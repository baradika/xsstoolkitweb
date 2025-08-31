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
  useSidebar,
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
  const { open, setOpen } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Deteksi ukuran layar
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  const isActive = (path: string) => currentPath === path

  // Tutup sidebar mobile saat mengklik link
  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md text-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Overlay untuk mobile */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar 
        className={`border-r border-sidebar-border bg-sidebar ${
          isMobile 
            ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : ''
        }`}
      >
        <SidebarContent>
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
                  onClick={() => setMobileOpen(false)}
                  className="ml-auto p-1 rounded-md hover:bg-sidebar-accent text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                            isActive
                              ? ""
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className={`text-xs ${isActive(item.url) ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
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
          <div className="mt-auto p-4 border-t border-sidebar-border">
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