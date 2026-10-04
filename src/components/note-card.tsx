'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
                    'mb-4 inline-block w-full break-inside-avoid align-top overflow-hidden transition-all',
                    getColorClass(note.color)
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-0">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold" title={note.title}>
                            {note.title}
                        </h3>
                        <p className="text-xs text-muted-foreground dark:text-white">
                            {note.category}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
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

                <CardContent className="min-w-0 w-full p-4">
                    {note.content && (
                        <div
                            className="break-words whitespace-pre-line text-sm [&_a]:underline [&_blockquote]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic [&_em]:italic [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                        >
                            <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3 border-t bg-white bg-opacity-50 p-4">
                    <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={note.creator_image || ''} alt={note.creator_name} />
                            <AvatarFallback>{note.creator_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span
                            className="truncate text-xs text-muted-foreground dark:text-white"
                            title={note.creator_name}
                        >
                            {note.creator_name}
                        </span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground dark:text-white">
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
