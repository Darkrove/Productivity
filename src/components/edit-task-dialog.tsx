'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { updateTask } from '@/actions/task-actions';
import { useToast } from '@/hooks/use-toast';

interface Member {
    id: number;
    name: string;
    email: string;
    image: string | null;
    role: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
    duration: number | null;
    workspace_id: number;
    assigned_to: number | null;
}

interface EditTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
    workspaceId: number;
    members: Member[];
    userId: number;
}

export function EditTaskDialog({
    open,
    onOpenChange,
    task,
    workspaceId,
    members,
    userId,
}: EditTaskDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.append('taskId', task.id.toString());
        formData.append('workspaceId', workspaceId.toString());

        try {
            const result = await updateTask(formData);

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Failed to update task',
                    description: result.error,
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: 'Task updated',
                description: 'Your task has been updated successfully',
            });

            onOpenChange(false);
            setIsLoading(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Please try again later',
            });
            setIsLoading(false);
        }
    }

    // Format date for input field
    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Update the details of your task.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Task title"
                                defaultValue={task.title}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Task description"
                                defaultValue={task.description || ''}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={task.status}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select name="priority" defaultValue={task.priority}>
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="assignedTo">Assign To</Label>
                            <Select name="assignedTo" defaultValue={task.assigned_to?.toString()}>
                                <SelectTrigger id="assignedTo">
                                    <SelectValue placeholder="Select member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map(member => (
                                        <SelectItem key={member.id} value={member.id.toString()}>
                                            {member.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    name="dueDate"
                                    type="date"
                                    defaultValue={formatDateForInput(task.due_date)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    placeholder="60"
                                    defaultValue={task.duration || ''}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
