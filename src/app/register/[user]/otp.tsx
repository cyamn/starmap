"use client";

import React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { api } from "@/utils/api";

interface OtpProperties {
  userID: string;
}

const Otp: React.FC<OtpProperties> = ({ userID }) => {
  const [value, setValue] = React.useState("");

  const { mutate: verifyOTP } = api.user.verify.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        // Redirect to /profile
        window.location.href = "/review";
      } else {
        setValue("");
      }
    },
  });

  const updateValue = (value: string) => {
    setValue(value);
    if (value.length === 6) {
      verifyOTP({ id: userID, otp: value });
    }
  };

  const {
    data: user,
    isLoading,
    isError,
  } = api.user.getUnverified.useQuery({
    id: userID,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col justify-center rounded-md text-center text-4xl text-primary">
      <div className="pt-8">We sent you a 6 digit code to</div>
      <div className="pb-8">{user?.email}</div>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => {
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
};

export default Otp;
