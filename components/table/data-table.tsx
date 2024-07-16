import { LoadingOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Select, Table, TableColumnsType, TableProps } from 'antd'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

// User data structure
type UserData = {
    key: string;
    id: number;
    username: string;
    email: string;
    phone: string;
    role: string;
    isActivated: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type FieldType = {
    username: string;
    email: string;
    phone: string;
    prefix: string;
    role: string;
};

export default function DataTable() {
    const { Option } = Select;
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<UserData | null>(null);

    const onChange: TableProps<UserData>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const onOpen = (data: UserData) => {
        setSelectedData(data);
        setOpen(true);
    }

    const handleCancel = () => {
        setSelectedData(null);
        setOpen(false);
    }


    const onEdit = async (values: FieldType) => {

        const res = await fetch("http://localhost:3000/api/v1/auth/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                phone: values.prefix + values.phone,
            }),
        });
        if (!res.ok) {
            throw new Error("Failed to create user");
        }
        return await res.json();
    };

    const { mutate: onEditMutate, isPending: onEditPending } = useMutation({
        mutationFn: onEdit,
        onSuccess: (value) => {
            toast.success("User data successfully updated");
        },
        onError: () => {
            toast.error("Failed to updated the user");
        },
    });


    // Generate 30 user data entries
    const dataSource: UserData[] = Array.from({ length: 30 }, (_, i) => ({
        key: (i + 1).toString(),
        id: i + 1,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `123-456-789${i}`,
        role: i % 2 === 0 ? "USER" : "ADMIN",
        isActivated: i % 2 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    }));

    // Add a new user with createdAt 10 minutes from now
    const tenMinutesFromNow = new Date();
    tenMinutesFromNow.setMinutes(tenMinutesFromNow.getMinutes() + 10);

    dataSource.push({
        key: "1111111",
        id: 1111,
        username: "arkarmin",
        email: "armian@gmail",
        phone: "0808098",
        role: "USER",
        isActivated: true,
        createdAt: tenMinutesFromNow,
        updatedAt: tenMinutesFromNow,
    })

    // Create unique filter options for usernames
    const usernameFilters = Array.from(
        dataSource.reduce((acc, user) => acc.add(user.username), new Set<string>())
    ).map(username => ({
        text: username,
        value: username,
    }));


    // Columns definition for the users table
    const columns: TableColumnsType<UserData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            filters: usernameFilters,
            filterMode: 'menu',
            filterSearch: true,
            onFilter: (value, record) => record.username.startsWith(value as string)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                {
                    text: 'USER',
                    value: 'USER',
                },
                {
                    text: 'ADMIN',
                    value: 'ADMIN',
                },
            ],
            filterMode: 'menu',
            filterSearch: true,
            onFilter: (value, record) => record.role === value
        },
        {
            title: 'Activated',
            dataIndex: 'isActivated',
            key: 'isActivated',
            render: (isActivated: boolean) => (isActivated ? "Yes" : "No"),
            filters: [
                {
                    text: 'Activate',
                    value: true,
                },
                {
                    text: 'Not activate',
                    value: false,
                },
            ],
            filterMode: 'menu',
            filterSearch: true,
            onFilter: (value, record) => record.isActivated === value
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: Date) => date.toLocaleString(),
            sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: Date) => date.toLocaleString(),
            sorter: (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: UserData) => {
                return (<div className='flex items-center gap-4'>
                    <Button onClick={() => onOpen(record)}>
                        Edit
                    </Button>
                    <Button danger onClick={() => onOpen(record)}>
                        Delete
                    </Button>
                </div>)
            },
        }
    ];

    const prefixSelector = (
        <Form.Item<FieldType> name="prefix" noStyle>
            <Select disabled={onEditPending} style={{ width: 70 }}>
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
        <div className='mx-auto w-[80%]'>
            <Table className='border rounded-lg' columns={columns} dataSource={dataSource} onChange={onChange} />
            <Modal
                open={open}
                title="Mange the user"
                footer={null}
                closeIcon={false}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onEditMutate}
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
                        <Input disabled={onEditPending} defaultValue={selectedData?.username} />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "The input is not valid E-mail!" },
                        ]}
                    >
                        <Input disabled={onEditPending} defaultValue={selectedData?.email} />
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
                            disabled={onEditPending}
                            addonBefore={prefixSelector}
                            style={{ width: "100%" }}
                            defaultValue={selectedData?.phone.split("-")[1]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: "Please input the role!",
                            },
                        ]}
                    >
                        <Select
                            defaultValue={selectedData?.role}
                            style={{ width: "100%" }}
                            options={[
                                { value: 'USER', label: 'User' },
                                { value: 'ADMIN', label: 'Admin' },
                            ]}
                        />
                    </Form.Item>
                    <div className="my-3 mb-5 flex justify-between items-center">
                        <Button disabled={onEditPending} type="primary" htmlType="submit">
                            {onEditPending ? (
                                <LoadingOutlined className="text-lg " />
                            ) : (
                                "Save"
                            )}
                        </Button>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}
