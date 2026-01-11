import { useState } from "react"
import { Search, ArrowRightLeft, Plus, Eye, FileText, Building } from "lucide-react"

export default function TransferPage() {
  const [transfers, setTransfers] = useState([
    { id: 1, studentName: "Ravi Kumar", rollNo: "201", class: "Class 10", section: "A", type: "Outgoing", toSchool: "Delhi Public School", reason: "Family relocation", date: "2024-12-10", status: "Completed", tcNumber: "TC-2024-001" },
    { id: 2, studentName: "Meera Singh", rollNo: "202", class: "Class 8", section: "B", type: "Incoming", fromSchool: "St. Mary's School", reason: "Better facilities", date: "2024-12-08", status: "Completed", tcNumber: "TC-2024-002" },
    { id: 3, studentName: "Anil Sharma", rollNo: "203", class: "Class 9", section: "A", type: "Outgoing", toSchool: "Kendriya Vidyalaya", reason: "Parent transfer", date: "2024-12-05", status: "Pending", tcNumber: "TC-2024-003" },
  ])

  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ studentName: "", rollNo: "", class: "", section: "", type: "Outgoing", school: "", reason: "" })

  const filteredTransfers = transfers.filter((t) => {
    const matchesSearch = t.studentName.toLowerCase().includes(search.toLowerCase()) || t.rollNo.includes(search)
    const matchesType = !filterType || t.type === filterType
    return matchesSearch && matchesType
  })

  const handleAdd = () => {
    setFormData({ studentName: "", rollNo: "", class: "", section: "", type: "Outgoing", school: "", reason: "" })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.studentName || !formData.rollNo || !formData.school) {
      alert("Please fill all required fields")
      return
    }
    const newTransfer = {
      id: Math.max(...transfers.map(t => t.id), 0) + 1,
      studentName: formData.studentName,
      rollNo: formData.rollNo,
      class: formData.class,
      section: formData.section,
      type: formData.type,
      ...(formData.type === "Outgoing" ? { toSchool: formData.school } : { fromSchool: formData.school }),
      reason: formData.reason,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      tcNumber: `TC-2024-${String(transfers.length + 1).padStart(3, '0')}`
    }
    setTransfers([...transfers, newTransfer])
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Transfer</h1>
          <p className="text-gray-500 text-sm mt-1">Manage student transfers and TC generation</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          New Transfer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{transfers.length}</p>
              <p className="text-xs text-gray-500">Total Transfers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{transfers.filter(t => t.type === "Outgoing").length}</p>
              <p className="text-xs text-gray-500">Outgoing</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{transfers.filter(t => t.type === "Incoming").length}</p>
              <p className="text-xs text-gray-500">Incoming</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{transfers.filter(t => t.status === "Pending").length}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Search by name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Incoming">Incoming</option>
            <option value="Outgoing">Outgoing</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterType("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Student</th>
                <th className="text-left p-4 font-medium text-gray-600">Class</th>
                <th className="text-left p-4 font-medium text-gray-600">Type</th>
                <th className="text-left p-4 font-medium text-gray-600">School</th>
                <th className="text-left p-4 font-medium text-gray-600">TC Number</th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No transfers found</td></tr>
              ) : (
                filteredTransfers.map((transfer) => (
                  <tr key={transfer.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{transfer.studentName}</p>
                        <p className="text-xs text-gray-500">Roll: {transfer.rollNo}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{transfer.class} - {transfer.section}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${transfer.type === "Incoming" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {transfer.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building className="w-4 h-4" />
                        {transfer.toSchool || transfer.fromSchool}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{transfer.tcNumber}</td>
                    <td className="p-4 text-gray-600">{transfer.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${transfer.status === "Completed" ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {transfer.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4 text-gray-500" /></button>
                      <button className="p-2 rounded-lg hover:bg-indigo-50"><FileText className="w-4 h-4 text-indigo-500" /></button>
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">New Transfer Request</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll No *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Type</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="Outgoing">Outgoing (To Other School)</option>
                  <option value="Incoming">Incoming (From Other School)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{formData.type === "Outgoing" ? "Transfer To School *" : "Transfer From School *"}</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea className="w-full border border-gray-200 p-2.5 rounded-lg" rows="2" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>Create Transfer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
