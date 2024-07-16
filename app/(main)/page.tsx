"use client"

import DataTable from '@/components/table/data-table'
import { useMounted } from '@/lib/custom-hook'
import { LoadingOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Avatar, Button, Card, Skeleton } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function MainPage() {
    const isMounted = useMounted();
    const router = useRouter();

    const logoutFn = async () => {
        const res = await fetch("http://localhost:3000/api/v1/auth/sign-out", {
            method: "GET",
        });
        if (!res.ok) {
            throw new Error("Failed to logout user");
        }
        return await res.json();
    };

    const { mutate: onLogout, isPending: logoutPending } = useMutation({
        mutationFn: logoutFn,
        onSuccess: () => {
            toast.success("User successfully logout");
        },
        onError: () => {
            toast.error("Failed to logout the user");
        },
    });

    return (
        <div className='w-full pt-16 md:pt-28 lg:pt-32'>
            <h1 className="text-xl text-center md:text-2xl lg:text-3xl font-bold mb-3">
                Welcome Back, 👋
            </h1>
            <div className='flex justify-center items-center my-5'>
                {
                    isMounted ? (
                        <Card style={{ minWidth: 400 }}>
                            <Card.Meta
                                avatar={
                                    <Avatar size={{
                                        sm: 30,
                                        md: 50,
                                        lg: 70,
                                        xl: 70,
                                        xxl: 70,
                                    }}>A</Avatar>
                                }
                                title={<h2 className='text-xl md:text-2xl'>Arkar Min</h2>}
                                description={
                                    <div>
                                        <p className='text-base text-neutral-800'>Email: arkar@gmail.com</p>
                                        <p className='text-base text-neutral-800'>Phone: +95-879879879</p>
                                        <p className='text-base text-neutral-800'>Created At: 12/2/2024</p>
                                        <p className='text-base text-neutral-800'>Updated At: 12/2/2024</p>
                                        <div className='flex items-center gap-4 mt-4'>
                                            <Button type="primary" onClick={() => onLogout()}>
                                                {logoutPending ? (
                                                    <LoadingOutlined className="text-lg " />
                                                ) : (
                                                    "Edit"
                                                )}
                                            </Button>
                                            <Button danger type="primary" onClick={() => onLogout()}>
                                                {logoutPending ? (
                                                    <LoadingOutlined className="text-lg " />
                                                ) : (
                                                    "Logout"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    ) : (
                        <LoadingOutlined className="text-lg text-center" />
                    )
                }
            </div>

            <h2 className="text-center text-lg md:text-xl mb-5 mt-8">Manage users</h2>
            {
                isMounted ? (<DataTable />) : (
                    <LoadingOutlined className="text-xl text-center" />
                )
            }
        </div>
    )
}
