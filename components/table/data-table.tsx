import { Button, Modal, Table, TableColumnsType, TableProps } from 'antd'
import React, { useState } from 'react'

// User data structure
interface UserData {
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

export default function DataTable() {
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

    return (
        <div className='mx-auto w-[80%]'>
            <Table className='border rounded-lg' columns={columns} dataSource={dataSource} onChange={onChange} />

            <Modal
                open={open}
                title="Mange the user"
                onCancel={handleCancel}
                footer={(_, { CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <Button>
                            Save
                        </Button>
                    </>
                )}
            >
                <p>{selectedData?.username}</p>
                <p>{selectedData?.email}</p>
                <p>{selectedData?.phone}</p>
            </Modal>
        </div>
    )
}
