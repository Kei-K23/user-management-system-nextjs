"use client";

import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import Link from "next/link";
import { LoadingOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMounted } from "@/lib/custom-hook";

type FieldType = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordPageProps = {
  params: {
    code: string;
  };
};

const ResetPasswordPage = ({ params }: ResetPasswordPageProps) => {
  const isMounted = useMounted();
  const router = useRouter();

  const onFinish = async (values: FieldType) => {
    if (values.password !== values.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (!params.code) {
      throw new Error("Missing password reset verification code");
    }

    const res = await fetch(
      "http://localhost:3000/api/v1/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        //! TODO: Need to add two fields code and userId
        body: JSON.stringify({
          password: values.password,
          code: params.code,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to reset the user password");
    }
    return await res.json();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onFinish,
    onSuccess: () => {
      toast.success("User password successfully reset");
      // Navigate to account verification page
      router.push(`/sign-in`);
    },
    onError: () => {
      toast.error("Failed to reset the user password");
    },
  });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center pt-10 md:pt-20">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
        Reset Your Password
      </h1>
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
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password disabled={isPending} />
              </Form.Item>
              <Form.Item<FieldType>
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your confirm password!",
                  },
                ]}
              >
                <Input.Password disabled={isPending} />
              </Form.Item>
              <div className="my-3 mb-5 flex justify-between items-center">
                <Button disabled={isPending} type="primary" htmlType="submit">
                  {isPending ? (
                    <LoadingOutlined className="text-lg " />
                  ) : (
                    "Reset"
                  )}
                </Button>
                <Link href="/forgot-password" aria-disabled={isPending}>
                  Resend password reset email!
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      ) : (
        <LoadingOutlined className="text-3xl mt-5" />
      )}
    </div>
  );
};

export default ResetPasswordPage;
