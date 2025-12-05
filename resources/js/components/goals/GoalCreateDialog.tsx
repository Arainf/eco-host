"use client"

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export default function GoalCreateDialog({ categories = [], onSuccess }: any) {
    const [open, setOpen] = useState(false);
    const [payload, setPayload] = useState({
        name: '',
        description: '',
        category_name: '',
        category_color: '',
        target_amount: 0,
        deadline: ''
    });

    const create = async () => {
        try {
            await axios.post('/data/goals', payload);
            toast.success('Goal created');
            setOpen(false);
            onSuccess?.();
            setPayload({ name: '', description: '', category_name: '', category_color: '', target_amount: 0, deadline: '' });
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Create failed');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/*<DialogTrigger asChild>*/}
            {/*    <Button size="sm">New Goal</Button>*/}
            {/*</DialogTrigger>*/}

            <DialogContent>
                <div className="space-y-3">
                    <Input placeholder="Goal name" value={payload.name} onChange={(e)=>setPayload({...payload, name: e.target.value})} />
                    <Input placeholder="Description" value={payload.description} onChange={(e)=>setPayload({...payload, description: e.target.value})} />
                    <Select value={payload.category_name} onValueChange={(v)=> {
                        const cat = categories.find((c:any)=>c.name===v);
                        setPayload({...payload, category_name: v, category_color: cat?.color ?? ''});
                    }}>
                        <SelectTrigger className="w-[200px]"><SelectValue placeholder="Category"/></SelectTrigger>
                        <SelectContent>
                            {categories.map((c:any)=> <SelectItem key={c.id ?? c.name} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Target amount (₱)" value={payload.target_amount} onChange={(e)=>setPayload({...payload, target_amount: Number(e.target.value)})} />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={()=>setOpen(false)}>Cancel</Button>
                        <Button onClick={create}>Create</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
