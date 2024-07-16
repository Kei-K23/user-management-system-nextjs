import { TableColumnsType } from "antd";

// User data structure
export interface UserData {
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
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.username.startsWith(value as string),
        width: "40%"
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
    },
    {
        title: 'Activated',
        dataIndex: 'isActivated',
        key: 'isActivated',
        render: (isActivated: boolean) => (isActivated ? "Yes" : "No"),
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: Date) => date.toLocaleString(),
    },
    {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (date: Date) => date.toLocaleString(),
    },
];

// Export dataSource and columns
export { dataSource, columns };
