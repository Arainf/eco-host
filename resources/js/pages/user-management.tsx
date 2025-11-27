"use client"

import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import UserCreateDialog from '@/components/user-management/UserFormDialog';
import UserEditDialog from '@/components/user-management/UserEditDialog';

export default function UserManagementPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [createOpen, setCreateOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    async function load() {
        setLoading(true);
        try {
            const res = await axios.get("/data/users");
            setUsers(res.data || []);
        } catch {
            setUsers([]);
        }
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    const totalUsers = users.length;
    const totalAdmins = users.filter((u: any) => u.is_admin).length;
    const totalRegular = totalUsers - totalAdmins;

    return (
        <AppLayout
            breadcrumbs={[{ title: "User Management", href: "/management" }]}
        >
            <Head title="User Management" />

            <div className="w-full mx-auto p-6 space-y-6">

                {/* HEADER */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage system users, assign roles, and control access levels.
                        Only administrators can access this section.
                    </p>
                </div>

                {/* SUMMARY BOXES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <p className="text-xs text-muted-foreground">Total Users</p>
                        <p className="text-xl font-bold">{totalUsers}</p>
                    </Card>

                    <Card className="p-4">
                        <p className="text-xs text-muted-foreground">Administrators</p>
                        <p className="text-xl font-bold text-green-600">{totalAdmins}</p>
                    </Card>

                    <Card className="p-4">
                        <p className="text-xs text-muted-foreground">Regular Users</p>
                        <p className="text-xl font-bold text-blue-600">{totalRegular}</p>
                    </Card>
                </div>

                {/* ADD USER BUTTON */}
                <div className="flex justify-end">
                    <Button onClick={() => setCreateOpen(true)} className="bg-green-600 hover:bg-green-700">
                        Add User
                    </Button>
                </div>

                {/* USER TABLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Users</CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-6 text-center space-y-3">
                                <p className="text-sm text-muted-foreground">No users found.</p>
                                <Button onClick={() => setCreateOpen(true)}>Add your first user</Button>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-muted/20">
                                <tr>
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Role</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((u: any) => (
                                    <tr key={u.id} className="border-t">
                                        <td className="p-3">{u.name}</td>
                                        <td className="p-3">{u.email}</td>
                                        <td className="p-3">
                                            <Badge variant={u.is_admin ? "default" : "secondary"}>
                                                {u.is_admin ? "Admin" : "User"}
                                            </Badge>
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditing(u)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => axios.delete(`/data/users/${u.id}`).then(load)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* DIALOGS */}
            <UserCreateDialog open={createOpen} onOpenChange={setCreateOpen} onSaved={load} />
            {editing && (
                <UserEditDialog
                    open={!!editing}
                    onOpenChange={() => setEditing(null)}
                    user={editing}
                    onSaved={load}
                />
            )}
        </AppLayout>
    );
}
