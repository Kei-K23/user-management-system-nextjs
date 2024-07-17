"use client";

import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import { useMounted } from "@/lib/custom-hook";
import { LoadingOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

type FieldType = {
  email: string;
};

export default function ForgotPasswordPage() {
  const isMounted = useMounted();
  const router = useRouter();
  const [isPasswordResetSuccess, setIsPasswordResetSuccess] = useState(false);

  const onFinish = async (values: FieldType) => {
    if (!values.email) {
      throw new Error("Email is missing");
    }

    const res = await fetch(
      "http://localhost:3000/api/v1/auth/reset-password/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to send reset password email to user");
    }
    return await res.json();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onFinish,
    onSuccess: () => {
      toast.success("Reset password email sent to user");
      setIsPasswordResetSuccess(true);
    },
    onError: (e) => {
      toast.error("Failed to send reset password email to user");
    },
  });

  const onBackClick = () => {
    router.back();
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center pt-20 md:pt-32">
      {!isPasswordResetSuccess ? (
        <>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
            Forgot Password!
          </h1>
          <p className="text-lg text-center max-w-[380px]">
            Enter your email and we will send you an email to reset your
            password
          </p>
          {isMounted ? (
            <Row
              justify="center"
              className="border-2 border-neutral-100 rounded-lg w-[350px] sm:w-[500px] md:w-[600px] mt-5"
            >
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form
                  name="basic"
                  layout="vertical"
                  initialValues={{ remember: true }}
                  onFinish={mutate}
                  autoComplete="off"
                  className="mt-4"
                  style={{ padding: "0 2rem" }}
                >
                  <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      {
                        type: "email",
                        message: "The input is not a valid E-mail!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <div className="my-3 mb-4 flex justify-between items-center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isPending}
                    >
                      Submit
                    </Button>
                    <Button onClick={onBackClick} htmlType="button">
                      Back
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          ) : (
            <LoadingOutlined className="text-3xl mt-5" />
          )}
        </>
      ) : (
        <>
          <div className="border-2 border-neutral-100 rounded-lg w-[350px] sm:w-[500px] md:w-[600px] mt-5 p-4">
            <h1 className="text-center text-xl md:text-2xl lg:text-3xl font-bold mb-3">
              Successfully sent password reset email
            </h1>
            <p className="text-lg text-center">
              We successfully sent the reset password verification mail to your
              email box. Please check the email and if it doesn&apos;t arrive,
              try again.
            </p>
            <div className="flex items-center justify-center mt-5">
              <Button onClick={() => setIsPasswordResetSuccess(false)}>
                Resend email
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
