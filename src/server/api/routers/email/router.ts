import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { publicProcedure } from "@/server/api/trpc";

import { exportAllSheets } from "./export-all";
import { sendEmail } from "./send-mail";

export const emailRouter = createTRPCRouter({
  send: publicProcedure
    .meta({
      openapi: {
        description: "Send an email",
        tags: ["email"],
        method: "POST",
        path: "/email",
      },
    })
    .input(z.object({ to: z.string(), subject: z.string(), text: z.string() }))
    .mutation(async ({ input }) => {
      console.log("Sending email.....");
      await sendEmail(input.to, input.subject, input.text);
    }),

  sendAllSheets: publicProcedure
    .meta({
      openapi: {
        description: "Send all sheets as zip file",
        tags: ["email"],
        method: "POST",
        path: "/email/sendAllSheets",
      },
    })
    .input(z.object({ to: z.string() }))
    .mutation(async ({ input }) => {
      console.log("Sending all sheets.....");
      const zipfile = await exportAllSheets();
      await sendEmail(input.to, "All sheets exported",
        "All sheets have been exported. Please find the attachment in this email.",
        "",
        [{ filename: "sheets.zip", content: zipfile }],);

      return { success: true };
    }),

});
