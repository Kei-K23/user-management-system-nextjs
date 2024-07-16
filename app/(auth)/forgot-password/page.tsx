"use client";

import React from "react";
import { Form, Input, Button, Row, Col, FormProps } from "antd";
import { useRouter } from "next/navigation";
import { useMounted } from "@/lib/custom-hook";
import { LoadingOutlined } from "@ant-design/icons";

type FieldType = {
  email: string;
};

export default function ForgotPasswordPage() {
  const isMounted = useMounted();
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const onBackClick = () => {
    router.back();
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center pt-20 md:pt-32">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
        Forgot Password!
      </h1>
      <p className="text-lg">
        Enter your email and we will send you a email to reset your password
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
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className="mt-4"
              style={{ padding: "0 2rem" }}
            >
              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "The input is not valid E-mail!" },
                ]}
              >
                <Input />
              </Form.Item>
              <div className="my-3 mb-4 flex justify-between items-center">
                <Button type="primary" htmlType="submit">
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
    </div>
  );
}
