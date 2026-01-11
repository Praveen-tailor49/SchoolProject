import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Shield, Check, X, Users } from "lucide-react"

const PERMISSIONS = [
  { id: "dashboard", label: "Dashboard Access", category: "General" },
  { id: "students_view", label: "View Students", category: "Students" },
  { id: "students_edit", label: "Edit Students", category: "Students" },
  { id: "students_delete", label: "Delete Students", category: "Students" },
  { id: "teachers_view", label: "View Teachers", category: "Teachers" },
  { id: "teachers_edit", label: "Edit Teachers", category: "Teachers" },
  { id: "classes_manage", label: "Manage Classes", category: "Academic" },
  { id: "attendance_manage", label: "Manage Attendance", category: "Academic" },
  { id: "fees_view", label: "View Fees", category: "Accounting" },
  { id: "fees_manage", label: "Manage Fees", category: "Accounting" },
  { id: "reports_view", label: "View Reports", category: "Reports" },
  { id: "settings_manage", label: "Manage Settings", category: "Settings" },
]

export default function RolesPage() {
  const [data, setData] = useState([
    { id: 1, name: "Super Admin", description: "Full system access with all permissions", color: "purple", users: 2, permissions: PERMISSIONS.map(p => p.id) },
    { id: 2, name: "Admin", description: "Administrative access with limited settings", color: "indigo", users: 5, permissions: ["dashboard", "students_view", "students_edit", "teachers_view", "teachers_edit", "classes_manage", "attendance_manage", "fees_view", "reports_view"] },
    { id: 3, name: "Teacher", description: "Access to teaching related features", color: "blue", users: 25, permissions: ["dashboard", "students_view", "attendance_manage"] },
    { id: 4, name: "Accountant", description: "Access to financial features only", color: "green", users: 3, permissions: ["dashboard", "fees_view", "fees_manage", "reports_view"] },
    { id: 5, name: "Receptionist", description: "Basic access for front desk operations", color: "orange", users: 2, permissions: ["dashboard", "students_view"] },
  ])

  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "", color: "indigo", permissions: [] })

  const colors = {
    purple: "from-purple-500 to-purple-600",
    indigo: "from-indigo-500 to-indigo-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
    pink: "from-pink-500 to-pink-600",
  }

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: "", description: "", color: "indigo", permissions: [] })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ name: item.name, description: item.description, color: item.color, permissions: item.permissions })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const togglePermission = (permId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }))
  }

  const handleSave = () => {
    if (!formData.name) {
      alert("Please enter a role name")
      return
    }

    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setData([...data, { id: Math.max(...data.map((d) => d.id), 0) + 1, ...formData, users: 0 }])
    }
    setIsDialogOpen(false)
  }

  const groupedPermissions = PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = []
    acc[perm.category].push(perm)
    return acc
  }, {})

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-500 text-sm mt-1">Define roles and manage access permissions</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No roles found</div>
        ) : (
          filteredData.map((role) => (
            <div key={role.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${colors[role.color]}`}></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[role.color]} flex items-center justify-center`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{role.users} users</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(role)} className="p-2 rounded-lg hover:bg-gray-100 transition-all">
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button onClick={() => handleDelete(role.id)} className="p-2 rounded-lg hover:bg-red-50 transition-all">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{role.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.slice(0, 4).map((permId) => {
                    const perm = PERMISSIONS.find(p => p.id === permId)
                    return perm ? (
                      <span key={permId} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                        <Check className="w-3 h-3 mr-1 text-green-500" />
                        {perm.label}
                      </span>
                    ) : null
                  })}
                  {role.permissions.length > 4 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-600">
                      +{role.permissions.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Role" : "Create New Role"}</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Manager" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of this role" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                  <div className="flex gap-2">
                    {Object.keys(colors).map((color) => (
                      <button key={color} onClick={() => setFormData({ ...formData, color })} className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[color]} ${formData.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {perms.map((perm) => (
                          <label key={perm.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                            <input type="checkbox" checked={formData.permissions.includes(perm.id)} onChange={() => togglePermission(perm.id)} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                            <span className="text-sm text-gray-700">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all" onClick={handleSave}>{editingId ? "Update" : "Create"} Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
