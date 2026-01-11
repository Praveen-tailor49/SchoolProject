import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Users, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react"

const DEPARTMENTS = ["Administration", "Accounts", "Library", "Laboratory", "Sports", "Transport", "Maintenance", "Security", "Canteen"]
const DESIGNATIONS = ["Manager", "Supervisor", "Executive", "Assistant", "Clerk", "Helper", "Driver", "Guard"]

export default function StaffPage() {
  const [data, setData] = useState([
    { id: 1, name: "Ramesh Verma", email: "ramesh@school.edu", phone: "+91 98765 43210", department: "Administration", designation: "Manager", joinDate: "2020-01-15", status: "Active", address: "123 Main Street, Delhi", avatar: "RV" },
    { id: 2, name: "Sunita Devi", email: "sunita@school.edu", phone: "+91 98765 43211", department: "Accounts", designation: "Executive", joinDate: "2019-06-20", status: "Active", address: "456 Park Road, Delhi", avatar: "SD" },
    { id: 3, name: "Mohan Lal", email: "mohan@school.edu", phone: "+91 98765 43212", department: "Library", designation: "Assistant", joinDate: "2021-03-10", status: "Active", address: "789 Lake View, Delhi", avatar: "ML" },
    { id: 4, name: "Geeta Sharma", email: "geeta@school.edu", phone: "+91 98765 43213", department: "Laboratory", designation: "Supervisor", joinDate: "2018-09-05", status: "On Leave", address: "321 Hill Road, Delhi", avatar: "GS" },
    { id: 5, name: "Vijay Kumar", email: "vijay@school.edu", phone: "+91 98765 43214", department: "Transport", designation: "Driver", joinDate: "2022-02-28", status: "Active", address: "654 River Side, Delhi", avatar: "VK" },
    { id: 6, name: "Anita Rani", email: "anita@school.edu", phone: "+91 98765 43215", department: "Canteen", designation: "Helper", joinDate: "2021-08-12", status: "Active", address: "987 Garden Lane, Delhi", avatar: "AR" },
  ])

  const [search, setSearch] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", department: "", designation: "", joinDate: "", status: "Active", address: "" })
  const [viewMode, setViewMode] = useState("grid")

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase())
    const matchesDepartment = !filterDepartment || item.department === filterDepartment
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: "", email: "", phone: "", department: "", designation: "", joinDate: "", status: "Active", address: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ name: item.name, email: item.email, phone: item.phone, department: item.department, designation: item.designation, joinDate: item.joinDate, status: item.status, address: item.address })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.department || !formData.designation) {
      alert("Please fill all required fields")
      return
    }

    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      const initials = formData.name.split(" ").map(n => n[0]).join("").toUpperCase()
      setData([...data, { id: Math.max(...data.map((d) => d.id), 0) + 1, ...formData, avatar: initials }])
    }
    setIsDialogOpen(false)
  }

  const departmentColors = {
    "Administration": "bg-purple-100 text-purple-700",
    "Accounts": "bg-green-100 text-green-700",
    "Library": "bg-blue-100 text-blue-700",
    "Laboratory": "bg-orange-100 text-orange-700",
    "Sports": "bg-red-100 text-red-700",
    "Transport": "bg-yellow-100 text-yellow-700",
    "Maintenance": "bg-gray-100 text-gray-700",
    "Security": "bg-indigo-100 text-indigo-700",
    "Canteen": "bg-pink-100 text-pink-700",
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage non-teaching staff members</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Staff</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Active").length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "On Leave").length}</p>
              <p className="text-xs text-gray-500">On Leave</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{new Set(data.map(d => d.department)).size}</p>
              <p className="text-xs text-gray-500">Departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (<option key={dept} value={dept}>{dept}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterDepartment(""); setFilterStatus("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No staff members found</td></tr>
              ) : (
                filteredData.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {staff.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${departmentColors[staff.department] || "bg-gray-100 text-gray-700"}`}>
                        {staff.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{staff.designation}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="w-3 h-3" />
                          {staff.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${staff.status === "Active" ? "bg-green-100 text-green-700" : staff.status === "On Leave" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${staff.status === "Active" ? "bg-green-500" : staff.status === "On Leave" ? "bg-orange-500" : "bg-gray-400"}`}></span>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(staff)} className="p-2 rounded-lg hover:bg-gray-100 transition-all">
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(staff.id)} className="p-2 rounded-lg hover:bg-red-50 transition-all">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Staff Member" : "Add New Staff Member"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="staff@school.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })}>
                    <option value="">Select Designation</option>
                    {DESIGNATIONS.map((des) => (<option key={des} value={des}>{des}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Enter address" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all" onClick={handleSave}>{editingId ? "Update" : "Add"} Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
