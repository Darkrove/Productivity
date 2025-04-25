import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskCard, TaskCardProps } from '@/components/task-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateTaskDialog, Member } from '@/components/create-task-dialog';

interface WorkspacePageProps {
    params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    const workspaceId = Number.parseInt(id);
    const userId = Number.parseInt(session.user.id);

    // Check if user is a member of the workspace
    const memberCheck = await query(
        `SELECT wm.* FROM workspace_members wm
     WHERE wm.workspace_id = $1 AND wm.user_id = $2`,
        [workspaceId, userId]
    );

    if (memberCheck.length === 0) {
        redirect('/dashboard');
    }

    const isOwner = memberCheck[0].role === 'owner';

    // Get workspace details
    const workspaceResult = await query('SELECT * FROM workspaces WHERE id = $1', [workspaceId]);

    const workspace = workspaceResult[0];

    // Get workspace tasks
    const tasksResult = await query(
        `SELECT t.*, u.name as assigned_to_name, u.image as assigned_to_image 
     FROM tasks t
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.workspace_id = $1
     ORDER BY t.created_at DESC`,
        [workspaceId]
    );

    const tasks = tasksResult as TaskCardProps['task'][];

    // Get workspace members
    const membersResult = await query(
        `SELECT u.id, u.name, u.email, u.image, wm.role
     FROM workspace_members wm
     JOIN users u ON wm.user_id = u.id
     WHERE wm.workspace_id = $1`,
        [workspaceId]
    );

    const members = membersResult as Member[];

    // Filter tasks by status
    const activeTasks = tasks.filter(task => task.status === 'active');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    return (
        <div className="flex flex-col gap-4">
            <DashboardHeader
                heading={workspace.name}
                text={`${members.length} member${members.length !== 1 ? 's' : ''} · ${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
                workspaceId={workspaceId}
                workspaceName={workspace.name}
                isOwner={isOwner}
                userId={userId}
            >
                <CreateTaskDialog workspaceId={workspaceId} members={members} userId={userId} />
            </DashboardHeader>

            <Tabs defaultValue="active" className="w-full">
                <TabsList>
                    <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeTasks.length > 0 ? (
                            activeTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    workspaceId={workspaceId}
                                    members={members}
                                    userId={userId}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">No active tasks found.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {completedTasks.length > 0 ? (
                            completedTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    workspaceId={workspaceId}
                                    members={members}
                                    userId={userId}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">No completed tasks found.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
