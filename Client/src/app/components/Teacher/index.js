import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search, GraduationCap, Mail, Phone, BookOpen, Calendar, Loader2 } from "lucide-react"
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "../../../services/apiService"

const SUBJECTS = ["Mathematics", "English", "Science", "Hindi", "Social Studies", "Computer Science", "Physics", "Chemistry", "Biology"]
const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

export default function TeacherPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const res = await getTeachers()
      const teachers = res.data || []
      setData(teachers.map(t => ({
        id: t.id || t._id,
        name: t.name || t.teacher_name || '',
        email: t.email || '',
        phone: t.phone || t.mobile || '',
        subject: t.subject || '',
        classes: t.classes || [],
        qualification: t.qualification || '',
        experience: t.experience || '',
        status: t.status || 'Active',
        joinDate: t.join_date || t.joinDate || new Date().toISOString().split('T')[0],
        avatar: (t.name || t.teacher_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      })))
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const [search, setSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", classes: [], qualification: "", experience: "", status: "Active" })

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase())
    const matchesSubject = !filterSubject || item.subject === filterSubject
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesSubject && matchesStatus
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: "", email: "", phone: "", subject: "", classes: [], qualification: "", experience: "", status: "Active" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ name: item.name, email: item.email, phone: item.phone, subject: item.subject, classes: item.classes, qualification: item.qualification, experience: item.experience, status: item.status })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(id)
        setData(data.filter((item) => item.id !== id))
      } catch (error) {
        console.error('Error deleting teacher:', error)
        alert('Failed to delete teacher')
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.subject) {
      alert("Please fill all required fields")
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        teacher_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        classes: formData.classes,
        qualification: formData.qualification,
        experience: formData.experience,
        status: formData.status
      }
      
      if (editingId) {
        await updateTeacher(editingId, payload)
        setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
      } else {
        const res = await createTeacher(payload)
        const newTeacher = res.data
        const initials = formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        setData([...data, { 
          id: newTeacher.id || newTeacher._id || Math.max(...data.map((d) => d.id), 0) + 1, 
          ...formData, 
          avatar: initials, 
          joinDate: new Date().toISOString().split("T")[0] 
        }])
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving teacher:', error)
      alert('Failed to save teacher')
    } finally {
      setSaving(false)
    }
  }

  const subjectColors = {
    "Mathematics": "bg-blue-100 text-blue-700",
    "English": "bg-purple-100 text-purple-700",
    "Science": "bg-green-100 text-green-700",
    "Hindi": "bg-orange-100 text-orange-700",
    "Social Studies": "bg-yellow-100 text-yellow-700",
    "Computer Science": "bg-indigo-100 text-indigo-700",
    "Physics": "bg-cyan-100 text-cyan-700",
    "Chemistry": "bg-pink-100 text-pink-700",
    "Biology": "bg-emerald-100 text-emerald-700",
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-500">Loading teachers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage teaching staff and their assignments</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Teachers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-600" />
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
              <Calendar className="w-5 h-5 text-orange-600" />
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
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{new Set(data.map(d => d.subject)).size}</p>
              <p className="text-xs text-gray-500">Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {SUBJECTS.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterSubject(""); setFilterStatus("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No teachers found</div>
        ) : (
          filteredData.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">{teacher.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${subjectColors[teacher.subject] || "bg-gray-100 text-gray-700"}`}>{teacher.subject}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(teacher)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(teacher.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" /><span>{teacher.email}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /><span>{teacher.phone}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><GraduationCap className="w-4 h-4" /><span>{teacher.qualification}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Assigned Classes:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.classes.map((cls) => (<span key={cls} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{cls}</span>))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${teacher.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${teacher.status === "Active" ? "bg-green-500" : "bg-orange-500"}`}></span>
                  {teacher.status}
                </span>
                <span className="text-xs text-gray-400">{teacher.experience}</span>
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
              <h2 className="text-xl font-bold">{editingId ? "Edit Teacher" : "Add New Teacher"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="teacher@school.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} placeholder="e.g., M.Sc Physics" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="e.g., 5 years" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50" onClick={handleSave}>{saving ? 'Saving...' : (editingId ? "Update" : "Add")} Teacher</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
