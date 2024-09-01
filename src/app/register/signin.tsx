"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { UserResponses } from "@/server/api/routers/shared/responses";
import { api } from "@/utils/api";
import { validateEmail } from "@/utils/validate";

interface signinProperties {}

const Signin: React.FC<signinProperties> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  const { mutate: createUser } = api.user.create.useMutation({
    onSuccess: (data) => {
      if (data.status === UserResponses.emailExists) {
        setEmailError("Email already exists");
      } else if (data.status === UserResponses.success) {
        // Redirect to /id
        window.location.href = `/register/${data.id}`;
      } else {
        alert("Internal Error");
      }
    },
  });

  function validateClientSide() {
    let isValid = true;

    if (email.length === 0) {
      setEmailError("Email is required.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (validateEmail(email)) {
      setEmailError(null);
    } else {
      setEmailError("Not a correct Email.");
    }

    if (password.length < 8) {
      setPasswordError("Password is too short!");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (confirmPassword === password) {
      setConfirmPasswordError(null);
    } else {
      setConfirmPasswordError("Passwords do not match!");
      isValid = false;
    }

    if (terms) {
      setTermsError(null);
    } else {
      setTermsError("Need to accept Terms and Conditions.");
      isValid = false;
    }

    return isValid;
  }

  function passwordSignIn() {
    const valid = validateClientSide();
    if (!valid) return;
    createUser({ email, password });
  }

  return (
    <section className="rounded-md border border-secondary bg-secondary/25 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center px-6 py-8">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight">
            Create an account
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
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>
              <input
                value={confirmPassword}
                onInput={(event) => {
                  setConfirmPassword(event.currentTarget.value);
                }}
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className={cn(
                  "block w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900",
                  passwordError !== null && "border-2 border-danger",
                )}
              />
              <span className="text-sm text-danger">
                {confirmPasswordError}
              </span>
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  checked={terms}
                  onChange={() => {
                    setTerms(!terms);
                  }}
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className={cn(
                    "focus:ring-3 focus:ring-primary-300",
                    termsError !== null && "border-2 border-danger",
                  )}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-gray-500">
                  I accept the{" "}
                  <a
                    className="text-primary-600 font-medium hover:underline"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <div className="text-sm text-danger">{termsError}</div>
            <button
              onClick={() => {
                passwordSignIn();
              }}
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              Create an account
            </button>
            <p className="text-sm font-light text-gray-500">
              Already have an account?{" "}
              <a
                href="#"
                className="text-primary-600 font-medium hover:underline"
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
