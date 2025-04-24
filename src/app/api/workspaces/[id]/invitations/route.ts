import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendInvitationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workspaceId = Number.parseInt(id);
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user is a member of the workspace with admin or owner role
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
            WHERE workspace_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')`,
            [workspaceId, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json(
                { error: "You don't have permission to invite members" },
                { status: 403 }
            );
        }

        // Get workspace details
        const workspaceResult = await query('SELECT * FROM workspaces WHERE id = $1', [
            workspaceId,
        ]);
        const workspace = workspaceResult[0];

        if (!workspace) {
            return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
        }

        // Check if user already exists
        const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult[0];

        // Check if invitation already exists
        const existingInvitation = await query(
            "SELECT * FROM workspace_invitations WHERE workspace_id = $1 AND email = $2 AND status = 'pending'",
            [workspaceId, email]
        );

        if (existingInvitation.length > 0) {
            return NextResponse.json(
                { error: 'Invitation already sent to this email' },
                { status: 400 }
            );
        }

        // If user exists and is already a member, return error
        if (user) {
            const existingMember = await query(
                'SELECT * FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
                [workspaceId, user.id]
            );

            if (existingMember.length > 0) {
                return NextResponse.json(
                    { error: 'User is already a member of this workspace' },
                    { status: 400 }
                );
            }
        }

        // Generate invitation token
        const token = randomBytes(32).toString('hex');

        // Create invitation
        await query(
            `INSERT INTO workspace_invitations (workspace_id, email, invited_by, token, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
            [workspaceId, email, session.user.id, token]
        );

        // Send invitation email
        // Make sure we have valid strings for all parameters
        const senderName = session.user.name || 'A workspace member';
        const workspaceName = workspace.name || 'a workspace';

        await sendInvitationEmail(email, senderName, workspaceName, token);

        return NextResponse.json({ success: true, message: 'Invitation sent successfully' });
    } catch (error) {
        console.error('Error sending invitation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const workspaceId = Number.parseInt(id);

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [workspaceId, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Get pending invitations
        const invitations = await query(
            `SELECT wi.*, u.name as inviter_name 
       FROM workspace_invitations wi
       JOIN users u ON wi.invited_by = u.id
       WHERE wi.workspace_id = $1 AND wi.status = 'pending'
       ORDER BY wi.created_at DESC`,
            [workspaceId]
        );

        return NextResponse.json(invitations);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
