"use client";

import DataTable from "@/components/table/data-table";
import { useMounted } from "@/lib/custom-hook";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type UserFieldType = {
  username: string;
  email: string;
  phone: string;
  prefix: string;
  role: string;
};

export default function MainPage() {
  const { Option } = Select;
  const isMounted = useMounted();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const logoutFn = async () => {
    const res = await fetch("http://localhost:3000/api/v1/auth/sign-out", {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Failed to logout user");
    }
    return await res.json();
  };

  const deleteFn = async () => {
    const res = await fetch(
      `http://localhost:3000/api/v1/users?userId=${user?.data[0]?.id}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to delete user");
    }
    return await res.json();
  };

  const getCurrentUserFn = async () => {
    const res = await fetch("http://localhost:3000/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to get current login user");
    }
    return await res.json();
  };

  const getAllUsersFn = async () => {
    const res = await fetch(
      `http://localhost:3000/api/v1/users?userId=${user?.data[0]?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to get users");
    }
    return await res.json();
  };

  const onEdit = async (values: UserFieldType) => {
    if (!user?.data[0]?.id) {
      toast.error("Invalid user");
      return;
    }

    const res = await fetch(
      `http://localhost:3000/api/v1/users?userId=${user?.data[0]?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          phone: `${values.prefix}-${values.phone}`,
          role: values.role,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to update user");
    }
    return await res.json();
  };

  const { mutate: onEditMutate, isPending: onEditPending } = useMutation({
    mutationFn: onEdit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User data successfully updated");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to updated the user");
    },
  });

  const { mutate: onLogout, isPending: logoutPending } = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      toast.success("User successfully logout");
      // Clear local storage
      localStorage.removeItem("ums-user");
      // Navigate to sign in screen
      router.push("/sign-in");
    },
    onError: () => {
      toast.error("Failed to logout the user");
    },
  });

  const { mutate: onDelete, isPending: deletePending } = useMutation({
    mutationFn: deleteFn,
    onSuccess: (value) => {
      toast.success("User account successfully deleted");
      if (value.ownAccount == 1) {
        // Clear local storage
        localStorage.removeItem("ums-user");
        // Navigate to sign in screen
        router.push("/sign-in");
      }
    },
    onError: () => {
      toast.error("Failed to delete the user account");
    },
  });

  const { data: user } = useQuery({
    queryKey: ["users", "me"],
    queryFn: getCurrentUserFn,
    refetchOnMount: "always",
  });

  const { data: users, isPending: usersPending } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersFn,
    refetchOnMount: "always",
  });

  const prefixSelector = (
    <Form.Item<UserFieldType> name="prefix" noStyle>
      <Select
        defaultValue={user?.data[0]?.phone.split("-")[0]}
        disabled={onEditPending}
        style={{ width: 70 }}
      >
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
    <div className="w-full pt-16 ">
      <h1 className="text-xl text-center md:text-2xl lg:text-3xl font-bold mb-3">
        Welcome Back, 👋
      </h1>
      <div className="flex justify-center items-center my-5">
        {isMounted ? (
          <Card className="border-2 " style={{ minWidth: 360 }}>
            <Card.Meta
              avatar={
                <Avatar
                  size={{
                    sm: 50,
                    md: 50,
                    lg: 70,
                    xl: 70,
                    xxl: 70,
                  }}
                >
                  A
                </Avatar>
              }
              title={
                <div className="flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl">
                    {user?.data[0].username}
                  </h2>
                  <Popconfirm
                    title="Delete user"
                    description="Are you sure to delete the user?"
                    onConfirm={() => onDelete()}
                    okText="Yes"
                    cancelText="No"
                    disabled={deletePending}
                  >
                    <DeleteOutlined
                      disabled={deletePending}
                      className="cursor-pointer text-xl text-red-500 hover:text-red-600"
                    />
                  </Popconfirm>
                </div>
              }
              description={
                <div>
                  <p className="text-base text-neutral-800">
                    Email: {user?.data[0].email}
                  </p>
                  <p className="text-base text-neutral-800">
                    Phone: {user?.data[0].phone}
                  </p>
                  <p className="text-base text-neutral-800">
                    Created At:{" "}
                    {new Date(user?.data[0].createdAt).toLocaleDateString(
                      "en-CA"
                    )}
                  </p>
                  <p className="text-base text-neutral-800">
                    Updated At:{" "}
                    {new Date(user?.data[0].updatedAt).toLocaleDateString(
                      "en-CA"
                    )}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Button type="primary" onClick={() => setOpen(true)}>
                      {onEditPending ? (
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
        )}
      </div>
      {user?.data[0].role === "ADMIN" && (
        <>
          <h2 className="text-center text-lg md:text-xl mb-5 mt-8">
            Manage users
          </h2>
          {isMounted ? (
            usersPending ? (
              <div className="flex items-center justify-center">
                <LoadingOutlined className="text-2xl text-center" />
              </div>
            ) : (
              <DataTable dataSource={users.data} />
            )
          ) : (
            <div className="flex items-center justify-center">
              <LoadingOutlined className="text-2xl text-center" />
            </div>
          )}
        </>
      )}
      <Modal open={open} title="Update" footer={null} closeIcon={false}>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            username: user?.data[0]?.username,
            email: user?.data[0]?.email,
            prefix: user?.data[0]?.phone.split("-")[0],
            role: user?.data[0].role,
            phone: user?.data[0]?.phone.split("-")[1],
          }}
          onFinish={onEditMutate}
          autoComplete="off"
          className="mt-4"
          style={{ padding: "0 2rem" }}
        >
          <Form.Item<UserFieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              disabled={onEditPending}
              defaultValue={user?.data[0]?.username}
            />
          </Form.Item>
          <Form.Item<UserFieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input
              disabled={onEditPending}
              defaultValue={user?.data[0]?.email}
            />
          </Form.Item>
          <Form.Item<UserFieldType>
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
              defaultValue={user?.data[0]?.phone.split("-")[1]}
            />
          </Form.Item>
          {user?.data[0]?.role === "ADMIN" && (
            <Form.Item<UserFieldType>
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
                disabled={onEditPending}
                defaultValue={user?.data[0]?.role}
                style={{ width: "100%" }}
                options={[
                  { value: "USER", label: "User" },
                  { value: "ADMIN", label: "Admin" },
                ]}
              />
            </Form.Item>
          )}
          <div className="my-3 mb-5 flex justify-between items-center">
            <Button disabled={onEditPending} type="primary" htmlType="submit">
              {onEditPending ? (
                <LoadingOutlined className="text-lg " />
              ) : (
                "Save"
              )}
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
