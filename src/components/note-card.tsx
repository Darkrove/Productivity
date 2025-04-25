'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Heart, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { EditNoteDialog } from '@/components/edit-note-dialog';
import { deleteNote } from '@/actions/note-actions';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export interface NoteCardProps {
    note: {
        id: number;
        title: string;
        content: string | null;
        color: string;
        category: string;
        created_by: number;
        creator_name: string;
        creator_image: string | null;
        created_at: string;
    };
    workspaceId: number;
    userId: number;
    onEdit?: (noteId: number) => void;
    onDelete?: (noteId: number) => void;
}

export function NoteCard({ note, workspaceId, userId, onEdit, onDelete }: NoteCardProps) {
    const [liked, setLiked] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const { toast } = useToast();

    const getColorClass = (color: string) => {
        switch (color) {
            case 'yellow':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
            case 'blue':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
            case 'orange':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
            case 'green':
                return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            default:
                return 'bg-card text-card-foreground:';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleDelete = async () => {
        const formData = new FormData();
        formData.append('noteId', note.id.toString());
        formData.append('workspaceId', workspaceId.toString());

        const result = await deleteNote(formData);

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        } else {
            toast({
                title: 'Success',
                description: result.success,
            });
            if (onDelete) {
                onDelete(note.id);
            }
        }
    };

    return (
        <>
            <Card
                className={cn(
                    'overflow-hidden transition-all flex flex-col h-full',
                    getColorClass(note.color)
                )}
            >
                <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center">
                    <div>
                        <h3 className="font-semibold">{note.title}</h3>
                        <p className="text-xs text-muted-foreground dark:text-white">
                            {note.category}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDeleteAlertOpen(true)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className="p-4 flex-grow">
                    {note.content && <p className="text-sm whitespace-pre-line">{note.content}</p>}
                </CardContent>

                <CardFooter className="border-t p-4 flex justify-between items-center bg-white bg-opacity-50 mt-auto">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={note.creator_image || ''} alt={note.creator_name} />
                            <AvatarFallback>{note.creator_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <span className="text-xs text-muted-foreground dark:text-white">
                                {note.creator_name}
                            </span>
                    </div>
                    <span className="text-xs text-muted-foreground dark:text-white">
                            Created: {formatDate(note.created_at)}
                        </span>
                </CardFooter>
            </Card>

            <EditNoteDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                note={note}
                workspaceId={workspaceId}
                userId={userId}
            />

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the note "{note.title}". This action cannot
                            be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
