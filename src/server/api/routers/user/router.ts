
import bcrypt from "bcrypt";
import { createTRPCRouter } from "src/server/api/trpc";
import { publicProcedure } from "src/server/api/trpc";
import { z } from "zod";

import { UserResponses } from "@/server/api/routers/shared/responses";

import { sendEmail } from "../email/send-mail";
import { NotFoundError } from "../shared/errors";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .meta({
      openapi: {
        description: "Create a user",
        tags: ["user"],
        method: "POST",
        path: "/user",
      },
    })
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .output(z.object({ id: z.string(), status: z.nativeEnum(UserResponses) }))
    .mutation(async ({ input, ctx }) => {
      // check if email already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        return { id: "", status: UserResponses.emailExists };
      }

      // generate 6 digit otp
      const otp = Math.floor(100_000 + Math.random() * 900_000);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.email.split("@")[0],
          password: await bcrypt.hash(input.password, 10),
          otp: {
            create: {
              otp: await bcrypt.hash(otp.toString(), 10),
              // set to expire in 5 minutes
              expires: new Date(Date.now() + 5 * 60 * 1000),
            },
          },
        },
      });

      // check if user exists
      await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        return {
          id: "",
          status: UserResponses.internalError
        };
      }

      await sendEmail(input.email, "OTP for registration", `Your OTP is ${otp} and will expire in 5 minutes`);

      return {
        id: user.id,
        status: UserResponses.success,
      };
    }),

  requestOtp: publicProcedure
    .meta({
      openapi: {
        description: "Request an OTP",
        tags: ["user"],
        method: "POST",
        path: "/user/request-otp",
      },
    })
    .input(z.object({ email: z.string().email(), password: z.string(), purpose: z.string() }))
    .output(z.object({ id: z.string(), status: z.nativeEnum(UserResponses) }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
        include: { otp: true },
      });

      if (!user) {
        return { id: "", status: UserResponses.emailPasswordMismatch };
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password!);

      if (!passwordMatch) {
        return { id: "", status: UserResponses.emailPasswordMismatch };
      }

      // generate 6 digit otp
      const otp = Math.floor(100_000 + Math.random() * 900_000);

      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          otp: {
            upsert: {
              create: {
                otp: await bcrypt.hash(otp.toString(), 10),
                expires: new Date(Date.now() + 5 * 60 * 1000),
              },
              update: {
                otp: await bcrypt.hash(otp.toString(), 10),
                expires: new Date(Date.now() + 5 * 60 * 1000),
              },
            },
          },
        },
      });

      await sendEmail(input.email, `OTP for ${input.purpose}`, `Your OTP is ${otp} and will expire in 5 minutes`);

      return {
        id: user.id,
        status: UserResponses.success,
      };
    }
    ),

  getUnverified: publicProcedure
    .meta({
      openapi: {
        description: "Get some unverified users",
        tags: ["user"],
        method: "GET",
        path: "/user/unverified/:id",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ email: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id, emailVerified: null },
      });

      if (!user) {
        throw new NotFoundError("User");
      }

      return { email: user.email };
    }),

  verify: publicProcedure
    .meta({
      openapi: {
        description: "Verify a user",
        tags: ["user"],
        method: "POST",
        path: "/user/verify/:id",
      },
    })
    .input(z.object({ id: z.string(), otp: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: { otp: true },
      });

      const now = new Date();
      if (user === null || user.otp === null || user.otp.otp === null || user.otp.expires < now) {
        return { success: false };
      }

      const otpMatch = await bcrypt.compare(input.otp, user.otp.otp);

      if (!otpMatch) {
        return { success: false };
      }

      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          emailVerified: new Date(),
        },
      });

      // delete otp
      await ctx.prisma.oTP.delete({
        where: { userId: input.id },
      });

      await sendEmail(user.email!, "Welcome", "Welcome to our platform!");

      return { success: true };
    }),
});
