import { useState } from "react"
import { Plus, Edit2, Trash2, Search, IndianRupee, Tag } from "lucide-react"

export default function FeeTypesPage() {
  const [feeTypes, setFeeTypes] = useState([
    { id: 1, name: "Tuition Fee", code: "TF", amount: 5000, frequency: "Monthly", description: "Monthly tuition fee", status: "Active" },
    { id: 2, name: "Admission Fee", code: "AF", amount: 15000, frequency: "One-time", description: "New admission fee", status: "Active" },
    { id: 3, name: "Transport Fee", code: "TRF", amount: 2000, frequency: "Monthly", description: "School bus fee", status: "Active" },
    { id: 4, name: "Lab Fee", code: "LF", amount: 3000, frequency: "Yearly", description: "Science lab fee", status: "Active" },
    { id: 5, name: "Library Fee", code: "LIB", amount: 1000, frequency: "Yearly", description: "Library membership", status: "Active" },
    { id: 6, name: "Sports Fee", code: "SF", amount: 2000, frequency: "Yearly", description: "Sports activities fee", status: "Inactive" },
  ])

  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", code: "", amount: "", frequency: "Monthly", description: "", status: "Active" })

  const filteredFeeTypes = feeTypes.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.code.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: "", code: "", amount: "", frequency: "Monthly", description: "", status: "Active" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ name: item.name, code: item.code, amount: item.amount, frequency: item.frequency, description: item.description, status: item.status })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this fee type?")) {
      setFeeTypes(feeTypes.filter((f) => f.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.amount) {
      alert("Please fill all required fields")
      return
    }
    if (editingId) {
      setFeeTypes(feeTypes.map((f) => (f.id === editingId ? { ...f, ...formData, amount: Number(formData.amount) } : f)))
    } else {
      setFeeTypes([...feeTypes, { id: Math.max(...feeTypes.map((f) => f.id), 0) + 1, ...formData, amount: Number(formData.amount) }])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Types</h1>
          <p className="text-gray-500 text-sm mt-1">Manage different types of fees</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add Fee Type
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{feeTypes.length}</p>
              <p className="text-xs text-gray-500">Total Fee Types</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{feeTypes.filter(f => f.status === "Active").length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{feeTypes.filter(f => f.frequency === "Monthly").length}</p>
              <p className="text-xs text-gray-500">Monthly Fees</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{feeTypes.filter(f => f.frequency === "Yearly").length}</p>
              <p className="text-xs text-gray-500">Yearly Fees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Search fee types..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Fee Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeeTypes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No fee types found</div>
        ) : (
          filteredFeeTypes.map((fee) => (
            <div key={fee.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {fee.code}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${fee.status === "Active" ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {fee.status}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{fee.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{fee.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">₹{fee.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{fee.frequency}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(fee)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(fee.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
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
              <h2 className="text-xl font-bold">{editingId ? "Edit Fee Type" : "Add New Fee Type"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Name *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="One-time">One-time</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-200 p-2.5 rounded-lg" rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
