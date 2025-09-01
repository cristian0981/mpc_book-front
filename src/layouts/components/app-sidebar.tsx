import * as React from "react"
import { Frame, GalleryVerticalEnd, PieChart, Map, BookOpen, Bot, Settings2, SquareTerminal, CircleSmall, Book } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nac-user"
import { useAuth } from "@/contexts/auth-context"
import { NavMenu } from "./nav-menu"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Books",
      url: "books", // ← Cambiar de "#" a "/books"
      icon: BookOpen,
    },
    {
      title: "Authors",
      url: "authors", // ← Cambiar de "#" a "/authors"
      icon: Bot,
    },
    {
      title: "genres",
      url: "genres", // ← Cambiar de "#" a "/genres"
      icon: CircleSmall,
    },
    {
      title: "Editorials",
      url: "editorials", // ← Cambiar de "#" a "/editorials"
      icon: Book,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {  user } = useAuth();


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem >
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BookOpen className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">CMPC BOOKS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
       <NavMenu items={data.navMain} />
      </SidebarContent>
       <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
