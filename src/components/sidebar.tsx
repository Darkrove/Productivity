"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDays, CheckSquare, Home, Plus, StickyNote, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWorkspace } from "@/actions/auth-actions"

interface Workspace {
  id: number
  name: string
}

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch("/api/workspaces")
        const data = await response.json()
        setWorkspaces(data)
      } catch (error) {
        console.error("Error fetching workspaces:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchWorkspaces()
    }
  }, [session])

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-lg font-bold">Workspaces</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto" asChild>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Workspace</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form
                  action={async (formData) => {
                    formData.append("userId", session?.user?.id || "")
                    await createWorkspace(formData)
                    setOpen(false)
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Create New Workspace</DialogTitle>
                    <DialogDescription>Create a new workspace to organize your tasks and notes.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Workspace Name</Label>
                      <Input id="name" name="name" placeholder="My Workspace" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Workspace</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-2 px-2">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading workspaces...</div>
            ) : workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <Link
                  key={workspace.id}
                  href={`/dashboard/workspace/${workspace.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === `/dashboard/workspace/${workspace.id}`
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {workspace.name}
                </Link>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No workspaces found. Create one to get started.</div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-auto p-4">
          <nav className="grid gap-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/tasks"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard/tasks" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <CheckSquare className="h-4 w-4" />
              Tasks
            </Link>
            <Link
              href="/dashboard/notes"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard/notes" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <StickyNote className="h-4 w-4" />
              Notes
            </Link>
            <Link
              href="/dashboard/calendar"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard/calendar" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </Link>
            <Link
              href="/dashboard/team"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard/team" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Users className="h-4 w-4" />
              Team
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
