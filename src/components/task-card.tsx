'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { updateTaskStatus, deleteTask } from '@/actions/task-actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Clock, MoreHorizontal, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditTaskDialog } from '@/components/edit-task-dialog';
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

export interface TaskCardProps {
    task: {
        id: number;
        title: string;
        description: string | null;
        status: string;
        priority: string;
        due_date: string | null;
        duration: number | null;
        workspace_id: number;
        assigned_to: number | null;
        assigned_to_name: string | null;
        assigned_to_image: string | null;
    };
    workspaceId: number;
    members?: any[];
    userId: number;
    onDelete?: (taskId: number) => void;
}

export function TaskCard({ task, workspaceId, members = [], userId, onDelete }: TaskCardProps) {
    const { toast } = useToast();
    const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleStatusChange = async () => {
        const newStatus = isCompleted ? 'active' : 'completed';
        setIsCompleted(!isCompleted);

        const formData = new FormData();
        formData.append('taskId', task.id.toString());
        formData.append('status', newStatus);
        formData.append('workspaceId', workspaceId.toString());

        const result = await updateTaskStatus(formData);

        if (result.error) {
            // Revert the state if there was an error
            setIsCompleted(isCompleted);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
    };

    const handleDelete = async () => {
        const formData = new FormData();
        formData.append('taskId', task.id.toString());
        formData.append('workspaceId', workspaceId.toString());

        const result = await deleteTask(formData);

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
                onDelete(task.id);
            }
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Card className={cn('overflow-hidden flex flex-col h-full transition-all', isCompleted ? 'opacity-75' : '')}>
                <CardContent className="p-4 flex-grow">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <Checkbox
                                checked={isCompleted}
                                onCheckedChange={handleStatusChange}
                                className="mt-1"
                            />
                            <div>
                                <h3
                                    className={cn(
                                        'font-medium',
                                        isCompleted ? 'line-through text-muted-foreground' : ''
                                    )}
                                >
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {task.description}
                                    </p>
                                )}
                            </div>
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
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {task.priority && (
                            <span
                                className={cn(
                                    'rounded-full px-2 py-1 text-xs font-medium',
                                    getPriorityClass(task.priority)
                                )}
                            >
                                {task.priority}
                            </span>
                        )}

                        {task.duration && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDuration(task.duration)}
                            </span>
                        )}
                    </div>
                </CardContent>

                {task.assigned_to && (
                    <CardFooter className="border-t p-4 flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage
                                    src={task.assigned_to_image || ''}
                                    alt={task.assigned_to_name || ''}
                                />
                                <AvatarFallback>
                                    {task.assigned_to_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                                {task.assigned_to_name}
                            </span>
                        </div>

                        {task.due_date && (
                            <span className="text-xs text-muted-foreground">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                        )}
                    </CardFooter>
                )}
            </Card>

            <EditTaskDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                task={task}
                workspaceId={workspaceId}
                members={members}
                userId={userId}
            />

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the task "{task.title}". This action cannot
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
