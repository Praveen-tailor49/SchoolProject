import { useState } from "react"
import { Plus, Edit2, Trash2, Search, BookOpen, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"

const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]
const SUBJECTS = ["Mathematics", "English", "Hindi", "Science", "Social Studies", "Computer Science"]

export default function HomeworkPage() {
  const [data, setData] = useState([
    { id: 1, title: "Algebra Practice Set", class: "Class 10", section: "A", subject: "Mathematics", assignedBy: "Dr. Rajesh", assignDate: "2024-12-15", dueDate: "2024-12-20", status: "Active", submissions: 32, totalStudents: 42 },
    { id: 2, title: "Essay Writing - My School", class: "Class 9", section: "B", subject: "English", assignedBy: "Mrs. Priya", assignDate: "2024-12-14", dueDate: "2024-12-18", status: "Active", submissions: 28, totalStudents: 40 },
    { id: 3, title: "Science Lab Report", class: "Class 10", section: "A", subject: "Science", assignedBy: "Mr. Amit", assignDate: "2024-12-10", dueDate: "2024-12-15", status: "Completed", submissions: 42, totalStudents: 42 },
    { id: 4, title: "Hindi Poem Analysis", class: "Class 11", section: "A", subject: "Hindi", assignedBy: "Mrs. Sunita", assignDate: "2024-12-12", dueDate: "2024-12-17", status: "Overdue", submissions: 25, totalStudents: 38 },
  ])

  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", class: "", section: "", subject: "", dueDate: "", description: "" })

  const filteredData = data.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesClass = !filterClass || item.class === filterClass
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesClass && matchesStatus
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ title: "", class: "", section: "", subject: "", dueDate: "", description: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ title: item.title, class: item.class, section: item.section, subject: item.subject, dueDate: item.dueDate, description: "" })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this homework?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.title || !formData.class || !formData.subject || !formData.dueDate) {
      alert("Please fill all required fields")
      return
    }
    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setData([...data, { 
        id: Math.max(...data.map((d) => d.id), 0) + 1, 
        ...formData, 
        assignedBy: "Admin",
        assignDate: new Date().toISOString().split("T")[0],
        status: "Active",
        submissions: 0,
        totalStudents: 40
      }])
    }
    setIsDialogOpen(false)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return "bg-blue-100 text-blue-700"
      case "Completed": return "bg-green-100 text-green-700"
      case "Overdue": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homework</h1>
          <p className="text-gray-500 text-sm mt-1">Assign and manage homework for students</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Assign Homework
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Homework</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Active").length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Completed").length}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Overdue").length}</p>
              <p className="text-xs text-gray-500">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Search homework..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">All Classes</option>
            {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterClass(""); setFilterStatus("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Homework Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Title</th>
                <th className="text-left p-4 font-medium text-gray-600">Class</th>
                <th className="text-left p-4 font-medium text-gray-600">Subject</th>
                <th className="text-left p-4 font-medium text-gray-600">Due Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Submissions</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No homework found</td></tr>
              ) : (
                filteredData.map((hw) => (
                  <tr key={hw.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{hw.title}</p>
                        <p className="text-xs text-gray-500">By {hw.assignedBy}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{hw.class} - {hw.section}</td>
                    <td className="p-4 text-gray-600">{hw.subject}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {hw.dueDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${(hw.submissions / hw.totalStudents) * 100}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-600">{hw.submissions}/{hw.totalStudents}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(hw.status)}`}>{hw.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(hw)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => handleDelete(hw.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
              <h2 className="text-xl font-bold">{editingId ? "Edit Homework" : "Assign New Homework"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter homework title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })}>
                    <option value="">Select Class</option>
                    {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })}>
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                    <option value="">Select Subject</option>
                    {SUBJECTS.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-200 p-2.5 rounded-lg" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter homework description"></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Assign"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
