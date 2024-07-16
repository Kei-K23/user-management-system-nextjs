"use client"

import DataTable from '@/components/table/data-table'
import { useMounted } from '@/lib/custom-hook'
import { LoadingOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function MainPage() {
    const isMounted = useMounted();
    const router = useRouter();
    const [open, setOpen] = useState(false);

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
        <div className='w-full h-full'>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
                Welcome Back, Arkar Min
            </h1>
            <Button danger type="primary" onClick={() => onLogout()}>
                {logoutPending ? (
                    <LoadingOutlined className="text-lg " />
                ) : (
                    "Logout"
                )}
            </Button>
            {
                isMounted ? (<>
                    <DataTable />

                </>) : (
                    <p>loading..</p>
                )
            }
        </div>
    )
}
