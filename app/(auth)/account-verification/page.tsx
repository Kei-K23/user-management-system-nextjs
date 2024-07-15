"use client";

import React from "react";
import VerificationInput from "react-verification-input";

export default function AccountVerification() {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center pt-20 md:pt-32">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
        Verify your account
      </h1>
      <p className="text-lg">
        Enter verification code that have send to your email
      </p>
      <div className="mt-5">
        <VerificationInput autoFocus />
      </div>
    </div>
  );
}
