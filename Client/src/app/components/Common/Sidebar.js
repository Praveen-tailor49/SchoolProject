import React, { useState } from "react"
import { LayoutDashboard, BookOpen, Users, Shield, BarChart3, ChevronDown, X, GraduationCap, ClipboardList, Library,
} from "lucide-react"
import { Link } from "react-router-dom";

 function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    label: "Academic",
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      { label: "Class Sections", href: "/academic/class-sections" },
      { label: "Subjects", href: "/academic/subjects" },
      { label: "Attendance", href: "/academic/attendance" },
      { label: "Study Materials", href: "/academic/study-materials" },
      { label: "Homework", href: "/academic/homework" },
      { label: "Noticeboard", href: "/academic/noticeboard" },
      { label: "Events", href: "/academic/events" },
    ],
  },
  {
    label: "Students",
    icon: <Users className="w-5 h-5" />,
    children: [
      { label: "All Students", href: "/student" },
      { label: "Add Student", href: "/stutent/add" },
      { label: "ID Cards", href: "/students/id/cards" },
      { label: "Promotion", href: "/students/promotion" },
      { label: "Transfer", href: "/students/transfer" },
      { label: "Certificates", href: "/students/certificates" },
    ],
  },
  {
    label: "Teachers",
    icon: <GraduationCap className="w-5 h-5" />,
    href: "/teachers",
  },
  {
    label: "Examination",
    icon: <ClipboardList className="w-5 h-5" />,
    children: [
      { label: "Manage Exams", href: "/examination/exams" },
      { label: "Exam Results", href: "/examination/results" },
    ],
  },
  {
    label: "Library",
    icon: <Library className="w-5 h-5" />,
    children: [
      { label: "Books", href: "/library/books" },
      { label: "Issue & Return", href: "/library/issue-return" },
    ],
  },
  {
    label: "Administrator",
    icon: <Shield className="w-5 h-5" />,
    children: [
      { label: "Admins", href: "/admin/admins" },
      { label: "Roles & Permissions", href: "/admin/roles" },
      { label: "Staff", href: "/admin/staff" },
    ],
  },
  {
    label: "Accounting",
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { label: "Fee Invoices", href: "/accounting/invoices" },
      { label: "Payments", href: "/accounting/payments" },
      { label: "Expense", href: "/accounting/expense" },
      { label: "Income", href: "/accounting/income" },
      { label: "Fee Types", href: "/accounting/fee-types" },
    ],
  },
]

export default function Sidebar({ open, setOpen }) {
  const [expandedItems, setExpandedItems] = useState([])
  const pathname = window.location.pathname

  const toggleExpand = (label) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    )
  }

  const isActive = (href) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href.split("/").slice(0, 3).join("/"))
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative lg:translate-x-0 lg:w-64 transition-transform duration-300 z-40",
          "bg-slate-900 border-r border-slate-800",
          "flex flex-col h-screen w-64",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-100 text-lg">EduMS</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg",
                    "text-slate-300 hover:text-white-100",
                    isActive(item.href)
                      ? "bg-slate-800 text-purple-400"
                      : "hover:bg-slate-800/50"
                  )}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ) : (
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-lg w-full",
                    "text-slate-300 hover:text-slate-100",
                    expandedItems.includes(item.label)
                      ? "bg-slate-800 text-purple-400"
                      : "hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedItems.includes(item.label) && "rotate-180"
                      )}
                    />
                  )}
                </button>
              )}

              {/* Sub menu */}
              {item.children && expandedItems.includes(item.label) && (
                <div className="mt-1 ml-2 border-l border-slate-700/50 py-1 space-y-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      onClick={() => setOpen(false)}
                      className={cn( "flex items-center gap-2 pl-8 px-4 py-2 rounded-lg text-sm", "text-slate-400 hover:text-slate-100",
                        isActive(child.href)
                          ? "text-purple-300 bg-slate-800/50"
                          : "hover:bg-slate-800/30"
                      )}
                    >
                      <span className="w-1 h-1 bg-slate-500 rounded-full" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="font-medium text-sm text-slate-300">Need Help?</p>
            <p className="text-xs mt-1 text-slate-500">Contact support team</p>
          </div>
        </div>
      </aside>
    </>
  )
}
