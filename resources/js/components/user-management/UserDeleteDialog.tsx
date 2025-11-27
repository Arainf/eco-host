"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"

export default function UserDeleteDialog({ open, onClose, user, onDeleted }: any) {

    const del = async () => {
        try {
            await axios.delete(`/data/users/${user.id}`)
            toast.success("User deleted")
            onDeleted()
            onClose()
        } catch (err: any) {
            toast.error(err.response?.data?.error ?? "Delete failed")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                </DialogHeader>

                <p>Are you sure you want to delete <b>{user?.name}</b>?</p>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={del}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
