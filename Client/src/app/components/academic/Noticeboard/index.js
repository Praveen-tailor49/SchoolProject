import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Bell, Calendar, Eye, Pin } from "lucide-react"

export default function NoticeboardPage() {
  const [data, setData] = useState([
    { id: 1, title: "Winter Vacation Notice", content: "School will remain closed from Dec 25 to Jan 5 for winter vacation.", category: "Holiday", priority: "High", publishDate: "2024-12-15", expiryDate: "2024-12-24", isPinned: true, views: 234 },
    { id: 2, title: "Annual Sports Day", content: "Annual Sports Day will be held on Dec 20. All students must participate.", category: "Event", priority: "Medium", publishDate: "2024-12-10", expiryDate: "2024-12-20", isPinned: true, views: 189 },
    { id: 3, title: "Fee Payment Reminder", content: "Last date for fee payment is Dec 31. Late fee will be charged after that.", category: "Fee", priority: "High", publishDate: "2024-12-01", expiryDate: "2024-12-31", isPinned: false, views: 456 },
    { id: 4, title: "Parent-Teacher Meeting", content: "PTM scheduled for Dec 22. Parents are requested to attend.", category: "Meeting", priority: "Medium", publishDate: "2024-12-12", expiryDate: "2024-12-22", isPinned: false, views: 123 },
  ])

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", content: "", category: "", priority: "Medium", expiryDate: "", isPinned: false })

  const categories = ["Holiday", "Event", "Fee", "Meeting", "Exam", "General"]

  const filteredData = data.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => b.isPinned - a.isPinned)

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ title: "", content: "", category: "", priority: "Medium", expiryDate: "", isPinned: false })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ title: item.title, content: item.content, category: item.category, priority: item.priority, expiryDate: item.expiryDate, isPinned: item.isPinned })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.title || !formData.content || !formData.category) {
      alert("Please fill all required fields")
      return
    }
    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setData([...data, { 
        id: Math.max(...data.map((d) => d.id), 0) + 1, 
        ...formData, 
        publishDate: new Date().toISOString().split("T")[0],
        views: 0
      }])
    }
    setIsDialogOpen(false)
  }

  const togglePin = (id) => {
    setData(data.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item)))
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "bg-red-100 text-red-700"
      case "Medium": return "bg-orange-100 text-orange-700"
      case "Low": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      "Holiday": "bg-purple-100 text-purple-700",
      "Event": "bg-blue-100 text-blue-700",
      "Fee": "bg-green-100 text-green-700",
      "Meeting": "bg-indigo-100 text-indigo-700",
      "Exam": "bg-red-100 text-red-700",
      "General": "bg-gray-100 text-gray-700"
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Noticeboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage school notices and announcements</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add New Notice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Notices</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Pin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.isPinned).length}</p>
              <p className="text-xs text-gray-500">Pinned</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.priority === "High").length}</p>
              <p className="text-xs text-gray-500">High Priority</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.reduce((sum, d) => sum + d.views, 0)}</p>
              <p className="text-xs text-gray-500">Total Views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Search notices..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterCategory("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No notices found</div>
        ) : (
          filteredData.map((notice) => (
            <div key={notice.id} className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all ${notice.isPinned ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {notice.isPinned && <Pin className="w-4 h-4 text-orange-500" />}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(notice.category)}`}>{notice.category}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(notice.priority)}`}>{notice.priority}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePin(notice.id)} className={`p-2 rounded-lg ${notice.isPinned ? 'bg-orange-100' : 'hover:bg-gray-100'}`}>
                    <Pin className={`w-4 h-4 ${notice.isPinned ? 'text-orange-500' : 'text-gray-400'}`} />
                  </button>
                  <button onClick={() => handleEdit(notice)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(notice.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{notice.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{notice.content}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {notice.publishDate}</span>
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {notice.views}</span>
                </div>
                <span className="text-xs">Expires: {notice.expiryDate}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Notice" : "Add New Notice"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter notice title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea className="w-full border border-gray-200 p-2.5 rounded-lg" rows="4" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Enter notice content"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" checked={formData.isPinned} onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })} />
                    <span className="text-sm text-gray-700">Pin this notice</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Publish"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
