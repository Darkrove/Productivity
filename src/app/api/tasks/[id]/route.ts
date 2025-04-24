import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

// Get task details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const taskId = Number.parseInt(id);

        // Get task details
        const taskResult = await query(
            `SELECT t.*, w.name as workspace_name, u.name as assigned_to_name, u.image as assigned_to_image 
       FROM tasks t
       JOIN workspaces w ON t.workspace_id = w.id
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = $1`,
            [taskId]
        );

        if (taskResult.length === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = taskResult[0];

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [task.workspace_id, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Update task
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const taskId = Number.parseInt(id);
        const body = await req.json();
        const { title, description, status, priority, dueDate, duration, assignedTo } = body;

        // Get task details to check permissions
        const taskResult = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);

        if (taskResult.length === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = taskResult[0];

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [task.workspace_id, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Update task
        await query(
            `UPDATE tasks 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           status = COALESCE($3, status), 
           priority = COALESCE($4, priority), 
           due_date = COALESCE($5, due_date), 
           duration = COALESCE($6, duration), 
           assigned_to = COALESCE($7, assigned_to),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8`,
            [title, description, status, priority, dueDate, duration, assignedTo, taskId]
        );

        return NextResponse.json({ success: true, message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete task
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const taskId = Number.parseInt(id);

        // Get task details to check permissions
        const taskResult = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);

        if (taskResult.length === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = taskResult[0];

        // Check if user is a member of the workspace
        const memberCheck = await query(
            `SELECT * FROM workspace_members 
       WHERE workspace_id = $1 AND user_id = $2`,
            [task.workspace_id, session.user.id]
        );

        if (memberCheck.length === 0) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Delete task
        await query('DELETE FROM tasks WHERE id = $1', [taskId]);

        return NextResponse.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
