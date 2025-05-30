import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { InviteMemberDialog } from '@/components/invite-member-dialog';
import { Member } from '@/components/create-task-dialog';

interface TeamPageProps {
  params: Promise<{ id: string }>;
}
export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const workspaceId = Number.parseInt(id);
  const userId = Number.parseInt(session.user.id);

  // Check if user is a member of the workspace
  const memberCheck = await query(
    `SELECT * FROM workspace_members 
     WHERE workspace_id = $1 AND user_id = $2`,
    [workspaceId, session.user.id]
  );

  if (memberCheck.length === 0) {
    redirect('/dashboard');
  }

  // Get workspace details
  const workspaceResult = await query('SELECT * FROM workspaces WHERE id = $1', [workspaceId]);
  const workspace = workspaceResult[0];

  // Get workspace members
  const membersResult = await query(
    `SELECT u.id, u.name, u.email, u.image, wm.role
     FROM workspace_members wm
     JOIN users u ON wm.user_id = u.id
     WHERE wm.workspace_id = $1
     ORDER BY 
       CASE 
         WHEN wm.role = 'owner' THEN 1
         WHEN wm.role = 'admin' THEN 2
         ELSE 3
       END`,
    [workspaceId]
  );

  const members = membersResult as Member[];

  // Get pending invitations
  const invitationsResult = await query(
    `SELECT wi.*, u.name as inviter_name
     FROM workspace_invitations wi
     JOIN users u ON wi.invited_by = u.id
     WHERE wi.workspace_id = $1 AND wi.status = 'pending'
     ORDER BY wi.created_at DESC`,
    [workspaceId]
  );

  const invitations = invitationsResult;

  const isOwner = memberCheck[0].role === 'owner';

  // Check if user is owner or admin
  const isOwnerOrAdmin = members.some(
    member =>
      member.id === Number.parseInt(session.user.id) && ['owner', 'admin'].includes(member.role)
  );

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        heading={workspace.name}
        text={`${members.length} member${members.length !== 1 ? 's' : ''} in this workspace, manage members here.`}
        workspaceId={workspaceId}
        workspaceName={workspace.name}
        isOwner={isOwner}
        userId={userId}
        members={members}
      >
        {/* <CreateNoteDialog workspaceId={workspaceId} userId={userId} /> */}
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map(member => (
          <Card key={member.id}>
            <CardContent className="p-6 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.image || ''} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.email}</p>
                <div
                  className={cn(
                    'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                    member.role === 'owner'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      : member.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  )}
                >
                  {member.role}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invitations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {invitations.map(invitation => (
              <Card key={invitation.id} className="truncate">
                <CardContent className="p-6">
                  <h3 className="font-medium">{invitation.email}</h3>
                  <p className="text-sm text-muted-foreground">
                    Invited by {invitation.inviter_name} on{' '}
                    {new Date(invitation.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                    Pending
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
