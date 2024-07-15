"use client"

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, FormProps, Checkbox } from 'antd';
import Link from 'next/link';
import { useMountedState } from "react-use"
import { useMounted } from '@/lib/use-mounted';

type FieldType = {
    email: string;
    password: string;
    remember?: boolean;
};

export default function SignInPage() {

    const isMounted = useMounted();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='w-full h-full flex flex-col justify-start items-center pt-20 md:pt-32'>
            <h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-3'>Welcome Back!</h1>
            <p className='text-lg'>Login in or create new account</p>
            {
                isMounted ? (<Row justify="center" className='border-2 border-neutral-100 rounded-lg w-[350px] sm:w-[500px] md:w-[600px] mt-5'>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Form
                            name="basic"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            className='mt-4'
                            style={{ padding: '0 2rem' }}
                        >
                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'The input is not valid E-mail!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item<FieldType> name="remember" valuePropName="checked" noStyle>
                                    <Checkbox >Remember me</Checkbox>
                                </Form.Item>

                                <Link href="/forgot-password">
                                    Forgot password
                                </Link>
                            </Form.Item>
                            <Form.Item className='flex justify-between items-center'>
                                <Button type="primary" htmlType="submit" >
                                    Log in
                                </Button>
                                <Link href="/sign-up" >Don&apos;t have an account! Register here</Link>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>) : (
                    <p>loading....</p>
                )
            }

        </div>
    )
}
