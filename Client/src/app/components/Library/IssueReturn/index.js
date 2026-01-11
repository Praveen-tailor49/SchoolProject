import { useState } from "react"
import { Plus, Search, BookOpen, RotateCcw, Calendar, User, AlertCircle } from "lucide-react"

export default function IssueReturnPage() {
  const [records, setRecords] = useState([
    { id: 1, bookTitle: "Mathematics for Class 10", studentName: "Arjun Kumar", studentId: "STU-101", class: "Class 10", issueDate: "2024-12-01", dueDate: "2024-12-15", returnDate: null, status: "Issued", fine: 0 },
    { id: 2, bookTitle: "Physics NCERT Class 12", studentName: "Priya Sharma", studentId: "STU-102", class: "Class 12", issueDate: "2024-11-25", dueDate: "2024-12-09", returnDate: null, status: "Overdue", fine: 50 },
    { id: 3, bookTitle: "English Grammar", studentName: "Rahul Singh", studentId: "STU-103", class: "Class 9", issueDate: "2024-11-20", dueDate: "2024-12-04", returnDate: "2024-12-03", status: "Returned", fine: 0 },
    { id: 4, bookTitle: "History of India", studentName: "Neha Gupta", studentId: "STU-104", class: "Class 11", issueDate: "2024-12-10", dueDate: "2024-12-24", returnDate: null, status: "Issued", fine: 0 },
  ])

  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState("issue")
  const [formData, setFormData] = useState({ bookTitle: "", studentName: "", studentId: "", class: "", dueDate: "" })

  const filteredRecords = records.filter((r) => {
    const matchesSearch = r.bookTitle.toLowerCase().includes(search.toLowerCase()) || r.studentName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleIssue = () => {
    setDialogType("issue")
    setFormData({ bookTitle: "", studentName: "", studentId: "", class: "", dueDate: "" })
    setIsDialogOpen(true)
  }

  const handleReturn = (id) => {
    if (window.confirm("Confirm book return?")) {
      setRecords(records.map(r => r.id === id ? { ...r, returnDate: new Date().toISOString().split("T")[0], status: "Returned" } : r))
    }
  }

  const handleSave = () => {
    if (!formData.bookTitle || !formData.studentName || !formData.dueDate) {
      alert("Please fill all required fields")
      return
    }
    const newRecord = {
      id: Math.max(...records.map(r => r.id), 0) + 1,
      ...formData,
      issueDate: new Date().toISOString().split("T")[0],
      returnDate: null,
      status: "Issued",
      fine: 0
    }
    setRecords([...records, newRecord])
    setIsDialogOpen(false)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Issued": return "bg-blue-100 text-blue-700"
      case "Returned": return "bg-green-100 text-green-700"
      case "Overdue": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issue & Return</h1>
          <p className="text-gray-500 text-sm mt-1">Manage book issue and return</p>
        </div>
        <button onClick={handleIssue} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Issue Book
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
              <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === "Issued").length}</p>
              <p className="text-xs text-gray-500">Currently Issued</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === "Overdue").length}</p>
              <p className="text-xs text-gray-500">Overdue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === "Returned").length}</p>
              <p className="text-xs text-gray-500">Returned</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{records.reduce((sum, r) => sum + r.fine, 0)}</p>
              <p className="text-xs text-gray-500">Total Fine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Search by book or student..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Issued">Issued</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterStatus("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Book</th>
                <th className="text-left p-4 font-medium text-gray-600">Student</th>
                <th className="text-left p-4 font-medium text-gray-600">Issue Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Due Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Return Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Fine</th>
                <th className="text-right p-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No records found</td></tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{record.bookTitle}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{record.studentName}</p>
                        <p className="text-xs text-gray-500">{record.studentId} | {record.class}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{record.issueDate}</td>
                    <td className="p-4 text-gray-600">{record.dueDate}</td>
                    <td className="p-4 text-gray-600">{record.returnDate || "-"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>{record.status}</span>
                    </td>
                    <td className="p-4">
                      {record.fine > 0 ? <span className="text-red-600 font-medium">₹{record.fine}</span> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="p-4 text-right">
                      {record.status !== "Returned" && (
                        <button onClick={() => handleReturn(record.id)} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 flex items-center gap-1 ml-auto">
                          <RotateCcw className="w-3 h-3" /> Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Issue Book</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.bookTitle} onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg" onClick={handleSave}>Issue Book</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
