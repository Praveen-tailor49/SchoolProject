import React from 'react'
import { Menu, Bell, Settings, User } from "lucide-react"

const TopNavbar = ({onMenuClick}) => {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">School Dashboard</h1>
          <p className="text-sm text-muted-foreground">Session: 2023-2024</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </button>
        <button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </button>
        <button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

export default TopNavbar