import React, { useState } from 'react'
import { Menu, Bell, Settings, User, Search, ChevronDown, LogOut, Globe } from "lucide-react"
import { useTranslation } from '../../contexts/LanguageContext'

const TopNavbar = ({onMenuClick}) => {
  const { t, language, toggleLanguage } = useTranslation()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: "New student enrolled", time: "2 min ago", unread: true },
    { id: 2, title: "Fee payment received", time: "1 hour ago", unread: true },
    { id: 3, title: "Attendance updated", time: "3 hours ago", unread: false },
  ]

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-gray-900">School Management System</h1>
          <p className="text-xs text-gray-500">Academic Session: 2024-2025</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search students, teachers, classes..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        >
          <Globe className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
          <span className="ml-1 text-sm font-medium text-gray-600 group-hover:text-indigo-600">
            {language === 'en' ? 'EN' : 'हि'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              {notifications.map((notif) => (
                <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-indigo-50/50' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@school.edu</p>
              </div>
              <div className="py-1">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <User className="w-4 h-4" /> My Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
              <div className="border-t border-gray-100 py-1">
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNavbar