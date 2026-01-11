import { useState } from "react"
import { Plus, Edit2, Trash2, Search, FileText, Download, Eye, Upload, BookOpen } from "lucide-react"

const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]
const SUBJECTS = ["Mathematics", "English", "Hindi", "Science", "Social Studies", "Computer Science"]

export default function StudyMaterialPage() {
  const [data, setData] = useState([
    { id: 1, title: "Chapter 1 - Algebra Notes", class: "Class 10", subject: "Mathematics", type: "PDF", size: "2.5 MB", uploadedBy: "Dr. Rajesh", uploadDate: "2024-12-10", downloads: 45 },
    { id: 2, title: "English Grammar Rules", class: "Class 9", subject: "English", type: "PDF", size: "1.8 MB", uploadedBy: "Mrs. Priya", uploadDate: "2024-12-08", downloads: 32 },
    { id: 3, title: "Science Lab Manual", class: "Class 10", subject: "Science", type: "PDF", size: "5.2 MB", uploadedBy: "Mr. Amit", uploadDate: "2024-12-05", downloads: 67 },
    { id: 4, title: "Hindi Sahitya Notes", class: "Class 11", subject: "Hindi", type: "DOC", size: "1.2 MB", uploadedBy: "Mrs. Sunita", uploadDate: "2024-12-01", downloads: 28 },
  ])

  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", class: "", subject: "", file: null })

  const filteredData = data.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesClass = !filterClass || item.class === filterClass
    const matchesSubject = !filterSubject || item.subject === filterSubject
    return matchesSearch && matchesClass && matchesSubject
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ title: "", class: "", subject: "", file: null })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ title: item.title, class: item.class, subject: item.subject, file: null })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.title || !formData.class || !formData.subject) {
      alert("Please fill all required fields")
      return
    }
    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setData([...data, { 
        id: Math.max(...data.map((d) => d.id), 0) + 1, 
        ...formData, 
        type: "PDF",
        size: "1.0 MB",
        uploadedBy: "Admin",
        uploadDate: new Date().toISOString().split("T")[0],
        downloads: 0
      }])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and share study materials with students</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add New Material
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Materials</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.reduce((sum, d) => sum + d.downloads, 0)}</p>
              <p className="text-xs text-gray-500">Total Downloads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{new Set(data.map(d => d.subject)).size}</p>
              <p className="text-xs text-gray-500">Subjects</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => new Date(d.uploadDate) > new Date(Date.now() - 7*24*60*60*1000)).length}</p>
              <p className="text-xs text-gray-500">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">All Classes</option>
            {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {SUBJECTS.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterClass(""); setFilterSubject("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No materials found</div>
        ) : (
          filteredData.map((material) => (
            <div key={material.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {material.type}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(material)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(material.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{material.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{material.class}</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{material.subject}</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{material.size}</span>
              </div>
              <div className="text-sm text-gray-500 mb-3">
                <p>Uploaded by: {material.uploadedBy}</p>
                <p>Date: {material.uploadDate}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500 flex items-center gap-1"><Download className="w-4 h-4" /> {material.downloads} downloads</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"><Eye className="w-4 h-4 text-gray-600" /></button>
                  <button className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200"><Download className="w-4 h-4 text-indigo-600" /></button>
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
              <h2 className="text-xl font-bold">{editingId ? "Edit Material" : "Add New Material"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter material title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })}>
                    <option value="">Select Class</option>
                    {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                    <option value="">Select Subject</option>
                    {SUBJECTS.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PDF, DOC, PPT (Max 10MB)</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Upload"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
