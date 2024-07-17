"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import VerificationInput from "react-verification-input";

export default function AccountVerification() {
  const router = useRouter();

  const accountVerifyFn = async (code: string) => {
    const userStoreData = localStorage.getItem("ums-user");

    if (!userStoreData) {
      throw new Error("Invalid user");
    }

    const user = JSON.parse(userStoreData);
    if (!code || code.length !== 6 || !user.id) {
      throw new Error("Invalid verification code");
    }

    const res = await fetch(
      "http://localhost:3000/api/v1/auth/verification/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          userId: user.id,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to verify the user account");
    }
    return await res.json();
  };

  const resendVerificationCodeFn = async () => {
    const userStoreData = localStorage.getItem("ums-user");
    if (!userStoreData) {
      throw new Error("Invalid user");
    }

    const user = JSON.parse(userStoreData);
    if (!user.id) {
      throw new Error("User id is missing to resend the verification code");
    }

    const res = await fetch(
      "http://localhost:3000/api/v1/auth/verification/resend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to resend the verification code");
    }
    return await res.json();
  };

  const { mutate: accountVerify } = useMutation({
    mutationFn: accountVerifyFn,
    onSuccess: () => {
      toast.success("Successfully verify your account");
      // Navigate to sing in page
      router.push("/sing-in");
    },
    onError: () => {
      toast.error("Failed to verify the user account");
    },
  });

  const {
    mutate: resendVerificationCode,
    isPending: isResendVerificationCodePending,
  } = useMutation({
    mutationFn: resendVerificationCodeFn,
    onSuccess: () => {
      toast.success("Successfully resend the verification code to your email");
    },
    onError: () => {
      toast.error("Failed to resend the verification code");
    },
  });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center pt-20 md:pt-32">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
        Verify your account
      </h1>
      <p className="text-lg text-center max-w-[380px]">
        Enter verification code that have send to your email
      </p>
      <div className="mt-5">
        <VerificationInput autoFocus onComplete={accountVerify} />
      </div>
      <p className="text-base mt-6 mb-4">
        Verification code will be expired after 10 minutes.
      </p>
      <Button
        disabled={isResendVerificationCodePending}
        onClick={() => resendVerificationCode()}
      >
        Resend verification code
      </Button>
    </div>
  );
}
