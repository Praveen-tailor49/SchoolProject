import { useState } from "react"
import { Plus, Edit2, Trash2, Search, ClipboardList, Calendar, Clock, CheckCircle } from "lucide-react"

const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

export default function ExamsPage() {
  const [data, setData] = useState([
    { id: 1, name: "Mid-Term Examination", type: "Term Exam", classes: ["Class 9", "Class 10"], startDate: "2024-12-20", endDate: "2024-12-28", status: "Scheduled", timetablePublished: true, admitCardPublished: false, resultPublished: false },
    { id: 2, name: "Unit Test - December", type: "Unit Test", classes: ["Class 6", "Class 7", "Class 8"], startDate: "2024-12-15", endDate: "2024-12-17", status: "Ongoing", timetablePublished: true, admitCardPublished: true, resultPublished: false },
    { id: 3, name: "Half Yearly Examination", type: "Term Exam", classes: ["Class 11", "Class 12"], startDate: "2024-11-15", endDate: "2024-11-25", status: "Completed", timetablePublished: true, admitCardPublished: true, resultPublished: true },
    { id: 4, name: "Pre-Board Examination", type: "Board Prep", classes: ["Class 10", "Class 12"], startDate: "2025-01-10", endDate: "2025-01-20", status: "Scheduled", timetablePublished: false, admitCardPublished: false, resultPublished: false },
  ])

  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", type: "", classes: [], startDate: "", endDate: "" })

  const examTypes = ["Unit Test", "Term Exam", "Board Prep", "Practice Test", "Annual Exam"]

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: "", type: "", classes: [], startDate: "", endDate: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ name: item.name, type: item.type, classes: item.classes, startDate: item.startDate, endDate: item.endDate })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.startDate) {
      alert("Please fill all required fields")
      return
    }
    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setData([...data, { 
        id: Math.max(...data.map((d) => d.id), 0) + 1, 
        ...formData, 
        status: "Scheduled",
        timetablePublished: false,
        admitCardPublished: false,
        resultPublished: false
      }])
    }
    setIsDialogOpen(false)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Scheduled": return "bg-blue-100 text-blue-700"
      case "Ongoing": return "bg-orange-100 text-orange-700"
      case "Completed": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Exams</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage examinations</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add New Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Exams</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Ongoing").length}</p>
              <p className="text-xs text-gray-500">Ongoing</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Scheduled").length}</p>
              <p className="text-xs text-gray-500">Scheduled</p>
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
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterStatus("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No exams found</div>
        ) : (
          filteredData.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{exam.name}</h3>
                  <span className="text-sm text-gray-500">{exam.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>{exam.status}</span>
                  <button onClick={() => handleEdit(exam)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(exam.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {exam.classes.map((cls) => (<span key={cls} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{cls}</span>))}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {exam.startDate}</span>
                <span>to</span>
                <span>{exam.endDate}</span>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <span className={`px-2 py-1 rounded text-xs ${exam.timetablePublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  Timetable {exam.timetablePublished ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${exam.admitCardPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  Admit Card {exam.admitCardPublished ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${exam.resultPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  Result {exam.resultPublished ? '✓' : '✗'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Exam" : "Add New Exam"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter exam name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="">Select Type</option>
                  {examTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
