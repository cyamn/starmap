"use client";

import React from "react";

import { api } from "@/utils/api";

interface developmentPanelProperties {}

const developmentPanel: React.FC<developmentPanelProperties> = () => {
  const { mutate: sendEmail } = api.email.send.useMutation({
    onSuccess: () => {
      alert("Email sent");
    },
    onError: (error) => {
      alert("Error sending email: " + error.message);
    },
  });

  const { mutate: exportAllData, isLoading: isSendingData } =
    api.email.sendAllSheets.useMutation({
      onSuccess: () => {
        alert("All sheets sent");
      },
      onError: (error) => {
        alert("Error sending all sheets: " + error.message);
      },
    });

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        onClick={() => {
          sendEmail({
            to: "ingmar@lowack.com",
            subject: "Test",
            text: "This is a test email",
          });
        }}
        className="rounded-md bg-primary p-1 text-background"
      >
        Send Email
      </button>
      <button
        onClick={() => {
          exportAllData({
            to: "ingmar@lowack.com",
          });
        }}
        className="rounded-md bg-primary p-1 text-background"
      >
        {isSendingData ? "Sending..." : "Send all sheets by email"}
      </button>
    </div>
  );
};

export default developmentPanel;
