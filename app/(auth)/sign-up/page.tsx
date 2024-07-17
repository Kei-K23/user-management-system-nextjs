"use client";

import React from "react";
import { Form, Input, Button, Row, Col, Select } from "antd";
import Link from "next/link";
import { useMounted } from "@/lib/custom-hook";
import { LoadingOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type FieldType = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  prefix: string;
};

const SignUpPage = () => {
  const { Option } = Select;
  const isMounted = useMounted();
  const router = useRouter();

  const onFinish = async (values: FieldType) => {
    if (values.password !== values.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const res = await fetch("http://localhost:3000/api/v1/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        phone: `${values.prefix}-${values.phone}`,
        password: values.password,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to create user");
    }
    return await res.json();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onFinish,
    onSuccess: (value) => {
      toast.success("User successfully registered");
      // Store the user data in local storage
      localStorage.setItem(
        "ums-user",
        JSON.stringify({ id: value.data[0].id, email: value.data[0].email })
      );
      // Navigate to account verification page
      router.push(`/account-verification`);
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });

  const prefixSelector = (
    <Form.Item<FieldType> name="prefix" noStyle>
      <Select disabled={isPending} style={{ width: 70 }}>
        <Option value="+95" key={"+95"}>
          +95
        </Option>
        <Option value="+75" key={"+75"}>
          +75
        </Option>
        <Option value="+86" key={"+86"}>
          +86
        </Option>
        <Option value="+87" key={"+87"}>
          +87
        </Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="w-full h-full flex flex-col justify-start items-center pt-10 md:pt-20">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
        Welcome Back!
      </h1>
      <p className="text-lg">Login in or create new account</p>
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
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input disabled={isPending} />
              </Form.Item>
              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "The input is not valid E-mail!" },
                ]}
              >
                <Input disabled={isPending} />
              </Form.Item>
              <Form.Item<FieldType>
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input
                  disabled={isPending}
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                />
              </Form.Item>

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
              <div className="my-3 mb-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <Button disabled={isPending} type="primary" htmlType="submit">
                  {isPending ? (
                    <LoadingOutlined className="text-lg " />
                  ) : (
                    "Sign up"
                  )}
                </Button>
                <Link href="/sign-in" aria-disabled={isPending}>
                  Already have an account! Sign in here
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

export default SignUpPage;
