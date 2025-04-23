"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MoreHorizontal, Heart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

export interface NoteCardProps {
  note: {
    id: number
    title: string
    content: string | null
    color: string
    category: string
    created_by: number
    creator_name: string
    creator_image: string | null
    created_at: string
  }
  onEdit?: (noteId: number) => void
  onDelete?: (noteId: number) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [liked, setLiked] = useState(false)

  const getColorClass = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-100"
      case "blue":
        return "bg-blue-100"
      case "orange":
        return "bg-orange-100"
      case "green":
        return "bg-green-100"
      default:
        return "bg-card"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className={cn("overflow-hidden transition-all", getColorClass(note.color))}>
      <CardHeader className="p-4 pb-0 flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{note.title}</h3>
          <p className="text-xs text-muted-foreground">{note.category}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(note.id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(note.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4">
        {note.content && <p className="text-sm whitespace-pre-line">{note.content}</p>}
      </CardContent>

      <CardFooter className="border-t p-4 flex justify-between items-center bg-white bg-opacity-50">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={note.creator_image || ""} alt={note.creator_name} />
            <AvatarFallback>{note.creator_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLiked(!liked)}
          className={cn(liked ? "text-red-500" : "text-muted-foreground")}
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Like</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
