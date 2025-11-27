"use client"

import { useState } from "react"
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

export default function UserCreateDialog({ open, onOpenChange, onSaved }: any) {
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        is_admin: false,
    })

    const update = (field: string, value: any) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const submit = async () => {
        if (!form.name || !form.email || !form.password) {
            return toast.error("Please fill out all required fields")
        }

        try {
            setLoading(true)
            await axios.post("/data/users", form)
            toast.success("User created")
            onSaved?.()
            onOpenChange(false)
            setForm({ name: "", email: "", password: "", is_admin: false })
        } catch (e) {
            toast.error("Create failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Full name"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Email</Label>
                        <Input
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="example@gmail.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            placeholder="••••••••"
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
                        {loading ? "Saving..." : "Create User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
