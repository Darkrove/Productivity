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
import { updateNote } from '@/actions/note-actions';
import { useToast } from '@/hooks/use-toast';

interface Note {
    id: number;
    title: string;
    content: string | null;
    color: string;
    category: string;
}

interface EditNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note: Note;
    workspaceId: number;
    userId: number;
}

export function EditNoteDialog({
    open,
    onOpenChange,
    note,
    workspaceId,
    userId,
}: EditNoteDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.append('noteId', note.id.toString());
        formData.append('workspaceId', workspaceId.toString());

        try {
            const result = await updateNote(formData);

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Failed to update note',
                    description: result.error,
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: 'Note updated',
                description: 'Your note has been updated successfully',
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                        <DialogDescription>Update the details of your note.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Note title"
                                defaultValue={note.title}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Note content"
                                defaultValue={note.content || ''}
                                disabled={isLoading}
                                rows={5}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select name="category" defaultValue={note.category}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="important">Important</SelectItem>
                                        <SelectItem value="todo">To-do</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="color">Color</Label>
                                <Select name="color" defaultValue={note.color}>
                                    <SelectTrigger id="color">
                                        <SelectValue placeholder="Select color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        <SelectItem value="yellow">Yellow</SelectItem>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="orange">Orange</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Note'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
