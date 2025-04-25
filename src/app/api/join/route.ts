import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Invalid invitation token' }, { status: 400 });
        }

        // Get invitation details
        const invitationResult = await query(
            `SELECT wi.*, w.name as workspace_name, w.id as workspace_id 
       FROM workspace_invitations wi
       JOIN workspaces w ON wi.workspace_id = w.id
       WHERE wi.token = $1 AND wi.status = 'pending' 
       AND (wi.expires_at IS NULL OR wi.expires_at > NOW())`,
            [token]
        );

        if (invitationResult.length === 0) {
            return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
        }

        const invitation = invitationResult[0];

        // Check if user is already a member of the workspace
        const memberCheck = await query(
            'SELECT * FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
            [invitation.workspace_id, session.user.id]
        );

        if (memberCheck.length > 0) {
            return NextResponse.json({
                message: 'You are already a member of this workspace',
                workspace: {
                    id: invitation.workspace_id,
                    name: invitation.workspace_name,
                },
            });
        }

        // Add user to workspace
        await query(
            `INSERT INTO workspace_members (workspace_id, user_id, role, created_at)
       VALUES ($1, $2, 'member', NOW())`,
            [invitation.workspace_id, session.user.id]
        );

        // Update invitation status
        await query(
            `UPDATE workspace_invitations 
       SET status = 'accepted', used_at = NOW()
       WHERE id = $1`,
            [invitation.id]
        );

        return NextResponse.json({
            success: true,
            message: 'Successfully joined workspace',
            workspace: {
                id: invitation.workspace_id,
                name: invitation.workspace_name,
            },
        });
    } catch (error) {
        console.error('Error joining workspace:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
