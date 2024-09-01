"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { UserResponses } from "@/server/api/routers/shared/responses";
import { api } from "@/utils/api";

interface loginProperties {}

const Login: React.FC<loginProperties> = () => {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [value, setValue] = React.useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { mutate: requestOtp } = api.user.requestOtp.useMutation({
    onSuccess: (data) => {
      if (data.status === UserResponses.emailPasswordMismatch) {
        setEmailError("Email or password do not match");
        setPasswordError("Email or password do not match");
      } else if (data.status === UserResponses.success) {
        setShowOTPInput(true);
      } else {
        alert("Internal Error");
      }
    },
  });

  async function updateValue(value: string) {
    setValue(value);
    if (value.length === 6) {
      const reponse = await signIn("credentials", {
        email,
        password,
        otp: value,
        redirect: false,
      });

      if (reponse !== undefined && reponse.ok) {
        window.location.href = "/review";
      } else {
        setValue("");
      }
    }
  }

  function passwordSignIn() {
    requestOtp({ email, password, purpose: "login" });
  }

  if (showOTPInput) {
    return (
      <div className="flex flex-col justify-center rounded-md text-center text-4xl text-primary">
        <div className="pt-8">We sent you a 6 digit code to</div>
        <div className="pb-8">{email}</div>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={async (value) => {
            updateValue(value);
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    );
  }

  return (
    <section className="rounded-md border border-secondary bg-secondary/25 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center px-6 py-8">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight">
            Login to your account
          </h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Your email
              </label>
              <input
                value={email}
                onInput={(event) => {
                  setEmail(event.currentTarget.value);
                }}
                type="email"
                name="email"
                id="email"
                className={cn(
                  "focus:ring-primary-600 block w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900",
                  emailError !== null && "border-2 border-danger",
                )}
                placeholder="your@mail.com"
              />
              <span className="text-sm text-danger">{emailError}</span>
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                value={password}
                onInput={(event) => {
                  setPassword(event.currentTarget.value);
                }}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className={cn(
                  "block w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900",
                  passwordError !== null && "border-2 border-danger",
                )}
              />
              <span className="text-sm text-danger">{passwordError}</span>
            </div>
            <button
              onClick={() => {
                passwordSignIn();
              }}
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              Log in
            </button>
            <p className="text-sm font-light text-gray-500">
              Don't have an account?{" "}
              <a
                href="register"
                className="text-primary-600 font-medium hover:underline"
              >
                sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
