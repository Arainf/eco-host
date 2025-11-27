"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function UserEditDialog({ open, onOpenChange, user, onSaved }: any) {
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        is_admin: false,
    })

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                password: "",
                is_admin: user.is_admin,
            })
        }
    }, [user])

    const update = (field: string, value: any) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const submit = async () => {
        try {
            setLoading(true)

            const payload: any = {
                name: form.name,
                email: form.email,
                is_admin: form.is_admin,
            }

            if (form.password.trim() !== "") {
                payload.password = form.password
            }

            await axios.put(`/data/users/${user.id}`, payload)

            toast.success("User updated")
            onSaved?.()
            onOpenChange(false)
        } catch (e) {
            toast.error("Update failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>New Password (optional)</Label>
                        <Input
                            type="password"
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            placeholder="Leave empty to keep current password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Administrator Access?</Label>
                        <Switch
                            checked={form.is_admin}
                            onCheckedChange={(v) => update("is_admin", v)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={submit} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
