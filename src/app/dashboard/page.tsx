import { cn } from "@/lib/utils"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckSquare, Plus, StickyNote } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get user's workspaces
  const workspaces = await query(
    `SELECT w.* FROM workspaces w
     JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE wm.user_id = $1
     ORDER BY w.created_at DESC`,
    [session.user.id],
  )

  // Get user's recent tasks
  const recentTasks = await query(
    `SELECT t.*, w.name as workspace_name FROM tasks t
     JOIN workspaces w ON t.workspace_id = w.id
     JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE wm.user_id = $1
     ORDER BY t.created_at DESC
     LIMIT 5`,
    [session.user.id],
  )

  // Get user's recent notes
  const recentNotes = await query(
    `SELECT n.*, w.name as workspace_name FROM notes n
     JOIN workspaces w ON n.workspace_id = w.id
     JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE wm.user_id = $1
     ORDER BY n.created_at DESC
     LIMIT 5`,
    [session.user.id],
  )

  // Calculate task completion stats
  const taskStats = await query(
    `SELECT 
       COUNT(*) as total,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
     FROM tasks t
     JOIN workspaces w ON t.workspace_id = w.id
     JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE wm.user_id = $1`,
    [session.user.id],
  )

  const stats = taskStats[0]
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        heading={`Good ${getTimeOfDay()}, ${session.user.name}`}
        text={`Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
      >
        <Link href="/dashboard/tasks/new">
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Task</span>
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.completed} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${completionPercentage}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
            <StickyNote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentNotes.length}</div>
            <p className="text-xs text-muted-foreground">Recent notes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspaces.length}</div>
            <p className="text-xs text-muted-foreground">Active workspaces</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your most recent tasks across all workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-xs text-muted-foreground">{task.workspace_name}</span>
                    </div>
                    <div
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        task.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800",
                      )}
                    >
                      {task.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No tasks found. Create a new task to get started.
                </div>
              )}
              {recentTasks.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/dashboard/tasks">
                    <Button variant="outline">View All Tasks</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your most recent notes across all workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <div key={note.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{note.title}</span>
                      <span className="text-xs text-muted-foreground">{note.workspace_name}</span>
                    </div>
                    <div className={cn("rounded-full px-2 py-1 text-xs font-medium", getColorClass(note.color))}>
                      {note.category}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No notes found. Create a new note to get started.
                </div>
              )}
              {recentNotes.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/dashboard/notes">
                    <Button variant="outline">View All Notes</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 18) return "Afternoon"
  return "Evening"
}

function getColorClass(color: string) {
  switch (color) {
    case "yellow":
      return "bg-yellow-100 text-yellow-800"
    case "blue":
      return "bg-blue-100 text-blue-800"
    case "orange":
      return "bg-orange-100 text-orange-800"
    case "green":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
