import { Shield, Code, Database, Menu, X } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  { 
    title: "Encoder/Decoder", 
    url: "/", 
    icon: Code,
    description: "XSS Payload Encoding & Decoding"
  },
  { 
    title: "Payload Database", 
    url: "/payload-database", 
    icon: Database,
    description: "Filtered XSS Payload Collection"
  },
]

export function AppSidebar() {
  const location = useLocation()
  const currentPath = location.pathname
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Deteksi ukuran layar
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Di desktop, sidebar selalu terbuka
      if (!mobile) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  // Tutup sidebar ketika route berubah (untuk mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-white md:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Overlay untuk mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar 
        className={`border-r border-sidebar-border bg-sidebar w-64 ${
          isMobile 
            ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'block'
        }`}
      >
        <SidebarContent className="h-full">
          {/* Header */}
          <div className="px-4 py-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Bar's XSS Toolkit</h1>
                <p className="text-xs text-muted-foreground">Script Kiddies Tool lol</p>
              </div>
              {isMobile && (
                <button 
                  onClick={closeSidebar}
                  className="ml-auto p-1 rounded-md hover:bg-sidebar-accent text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <SidebarGroup className="flex-1">
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        onClick={closeSidebar} // Langsung tutup sidebar saat diklik
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className={`text-xs ${currentPath === item.url ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {item.description}
                          </div>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Footer Info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Tool</p>
              <p>For CTF and Bug Bounty Hunting</p>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  )
}