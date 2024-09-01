"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";

import { UserAvatar } from "@/components/avatars/user";

interface ProfileProperties {
  user: Session["user"] | null;
}

function ConfirmedSignOutAndRedirect() {
  // confirmation dialog
  const confirm = window.confirm("Are you sure you want to log out?");
  if (!confirm) return;

  void signOut().then(() => {
    window.location.href = "/login";
    return;
  });
}

const Profile: React.FC<ProfileProperties> = ({ user }) => {
  if (!user) {
    return <div>Not logged in</div>;
  }
  return (
    <>
      <div className="flex w-full flex-row justify-center">
        <h1 className="border-x-8 border-primary px-4 text-5xl font-bold">
          Home
        </h1>
      </div>
      <div className="flex w-full flex-row gap-8">
        <div className="w-1/4 rounded-md border border-secondary bg-secondary/25 p-6 backdrop-blur-md">
          <div className="pb-4 text-xl font-bold">Logged in as</div>
          <div className="flex flex-row items-center gap-4">
            <UserAvatar user={user} size={64} />
            <div className="flex flex-col gap-2">
              <div className="text-xl font-bold text-primary">
                {user.name ?? "No name"}
              </div>
              <div className="text-lg text-gray-400">{user.email}</div>
            </div>
          </div>
          <a className="pr-4 text-gray-400 underline">Open Profile</a>
          <button
            onClick={ConfirmedSignOutAndRedirect}
            className="text-gray-400 underline"
          >
            Log out
          </button>
        </div>
        <div className="w-1/2 rounded-md border border-secondary bg-secondary/25 backdrop-blur-md"></div>
        <div className="w-1/4 rounded-md border  border-secondary bg-secondary/25 backdrop-blur-md"></div>
      </div>
    </>
  );
};

export default Profile;
