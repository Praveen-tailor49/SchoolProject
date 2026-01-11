import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Shield, Mail, Phone, MoreVertical } from "lucide-react"

const ROLES = ["Super Admin", "Admin", "Manager", "Coordinator"]

export default function AdminsPage() {
  const [data, setData] = useState([
    { id: 1, name: "Rajesh Kumar", email: "rajesh@school.edu", phone: "+91 98765 43210", role: "Super Admin", status: "Active", lastLogin: "2 hours ago", avatar: "RK" },
    { id: 2, name: "Priya Sharma", email: "priya@school.edu", phone: "+91 98765 43211", role: "Admin", status: "Active", lastLogin: "1 day ago", avatar: "PS" },
    { id: 3, name: "Amit Singh", email: "amit@school.edu", phone: "+91 98765 43212", role: "Manager", status: "Inactive", lastLogin: "1 week ago", avatar: "AS" },
    { id: 4, name: "Neha Gupta", email: "neha@school.edu", phone: "+91 98765 43213", role: "Coordinator", status: "Active", lastLogin: "3 hours ago", avatar: "NG" },
  ])

  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "", status: "Active" })

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = !filterRole || item.role === filterRole
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: "", email: "", phone: "", role: "", status: "Active" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ name: item.name, email: item.email, phone: item.phone, role: item.role, status: item.status })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill all required fields")
      return
    }

    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      const initials = formData.name.split(" ").map(n => n[0]).join("").toUpperCase()
      setData([...data, { id: Math.max(...data.map((d) => d.id), 0) + 1, ...formData, avatar: initials, lastLogin: "Never" }])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administrators</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system administrators and their access levels</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add Administrator
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Active").length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Inactive").length}</p>
              <p className="text-xs text-gray-500">Inactive</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.role === "Super Admin").length}</p>
              <p className="text-xs text-gray-500">Super Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">All Roles</option>
            {ROLES.map((role) => (<option key={role} value={role}>{role}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterRole(""); setFilterStatus("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No administrators found</div>
        ) : (
          filteredData.map((admin) => (
            <div key={admin.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {admin.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${admin.role === "Super Admin" ? "bg-purple-100 text-purple-700" : "bg-indigo-100 text-indigo-700"}`}>
                      {admin.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(admin)} className="p-2 rounded-lg hover:bg-gray-100 transition-all">
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="p-2 rounded-lg hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{admin.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{admin.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${admin.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${admin.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}></span>
                  {admin.status}
                </span>
                <span className="text-xs text-gray-400">Last login: {admin.lastLogin}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Administrator" : "Add New Administrator"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="admin@school.edu" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="">Select Role</option>
                  {ROLES.map((role) => (<option key={role} value={role}>{role}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all" onClick={handleSave}>{editingId ? "Update" : "Add"} Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
