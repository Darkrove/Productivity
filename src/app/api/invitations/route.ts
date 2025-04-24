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

        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'Invitation token is required' }, { status: 400 });
        }

        // Get invitation details
        const invitationResult = await query(
            `SELECT * FROM workspace_invitations 
       WHERE token = $1 AND status = 'pending'`,
            [token]
        );

        if (invitationResult.length === 0) {
            return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 });
        }

        const invitation = invitationResult[0];

        // Check if user's email matches the invitation email
        if (session.user.email !== invitation.email) {
            return NextResponse.json(
                { error: 'This invitation was sent to a different email address' },
                { status: 400 }
            );
        }

        // Check if user is already a member of the workspace
        const existingMember = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [invitation.workspace_id, session.user.id]
        );

        if (existingMember.length > 0) {
            // Update invitation status
            await query(
                `UPDATE workspace_invitations 
         SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
                [invitation.id]
            );

            return NextResponse.json(
                { error: 'You are already a member of this workspace' },
                { status: 400 }
            );
        }

        // Add user to workspace members
        await query(
            `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, 'member')`,
            [invitation.workspace_id, session.user.id]
        );

        // Update invitation status
        await query(
            `UPDATE workspace_invitations 
       SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
            [invitation.id]
        );

        // Get workspace details
        const workspaceResult = await query('SELECT * FROM workspaces WHERE id = $1', [
            invitation.workspace_id,
        ]);
        const workspace = workspaceResult[0];

        return NextResponse.json({
            success: true,
            message: 'Invitation accepted successfully',
            workspace,
        });
    } catch (error) {
        console.error('Error accepting invitation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
