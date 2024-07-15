"use client"

import React from 'react';
import { Form, Input, Button, Row, Col, FormProps, Select } from 'antd';
import Link from 'next/link';

type FieldType = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    prefix: string;
};

const ResponsiveForm = () => {

    const { Option } = Select;

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const prefixSelector = (
        <Form.Item<FieldType> name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="+95" key={"+95"}>+95</Option>
                <Option value="+75" key={"+75"}>+75</Option>
                <Option value="+86" key={"+86"}>+86</Option>
                <Option value="+87" key={"+87"}>+87</Option>
            </Select>
        </Form.Item>
    );

    return (
        <div className='w-full h-full flex flex-col justify-start items-center pt-20 md:pt-32'>
            <h1 className='text-xl md:text-2xl lg:text-3xl font-bold mb-3'>Welcome Back!</h1>
            <p className='text-lg'>Login in or create new account</p>
            <Row justify="center" className='border-2 border-neutral-100 rounded-lg w-[350px] sm:w-[500px] md:w-[600px] mt-5'>
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
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>
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
                            label="Phone Number"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Confirm Password"
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please input your confirm password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Sign up
                            </Button>
                            <Link href="/sign-in" >Already have an account! Sign in here</Link>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
};

export default ResponsiveForm;
