import { useState } from "react"
import Sidebar from "../SideBar"
import TopNavbar from "../Common/TopNavbar"


export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        {children}
      </div>
    </div>
  )
}