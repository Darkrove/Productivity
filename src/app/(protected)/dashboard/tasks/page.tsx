import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TaskCard, TaskCardProps } from '@/components/task-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AllTasksPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    // Get all tasks from workspaces the user is a member of
    const tasksResult = await query(
        `SELECT t.*, w.name as workspace_name, u.name as assigned_to_name, u.image as assigned_to_image 
     FROM tasks t
     JOIN workspaces w ON t.workspace_id = w.id
     JOIN workspace_members wm ON w.id = wm.workspace_id
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE wm.user_id = $1
     ORDER BY t.created_at DESC`,
        [session.user.id]
    );

    const tasks = tasksResult as TaskCardProps['task'][];

    // Filter tasks by status
    const activeTasks = tasks.filter(task => task.status === 'active');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    // Get all workspaces for the user to fetch members
    const workspacesResult = await query(
        `SELECT w.id, w.name
     FROM workspaces w
     JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE wm.user_id = $1`,
        [session.user.id]
    );

    const workspaces = workspacesResult;

    // Get all members for all workspaces
    const membersPromises = workspaces.map(async workspace => {
        const membersResult = await query(
            `SELECT u.id, u.name, u.email, u.image, wm.role
       FROM workspace_members wm
       JOIN users u ON wm.user_id = u.id
       WHERE wm.workspace_id = $1`,
            [workspace.id]
        );
        return {
            workspaceId: workspace.id,
            members: membersResult,
        };
    });

    const workspaceMembers = await Promise.all(membersPromises);

    // Function to get members for a specific workspace
    const getMembersForWorkspace = (workspaceId: number) => {
        const workspace = workspaceMembers.find(w => w.workspaceId === workspaceId);
        return workspace ? workspace.members : [];
    };

    return (
        <div className="flex flex-col gap-4">
            <DashboardHeader
                heading="All Tasks"
                text={`${tasks.length} task${tasks.length !== 1 ? 's' : ''} across all workspaces`}
            />

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
                                    workspaceId={task.workspace_id}
                                    members={getMembersForWorkspace(task.workspace_id)}
                                    userId={Number.parseInt(session.user.id)}
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
                                    workspaceId={task.workspace_id}
                                    members={getMembersForWorkspace(task.workspace_id)}
                                    userId={Number.parseInt(session.user.id)}
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
