import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react"
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../../../../services/apiService"

const CLASSES = [
  "Class 1","Class 2","Class 3","Class 4","Class 5","Class 6",
  "Class 7","Class 8","Class 9","Class 10","Class 11","Class 12",
]

const TYPES = ["Core","Elective"]

export default function SubjectsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const res = await getSubjects()
      const subjects = res.data || []
      setData(subjects.map(s => ({
        id: s.id || s._id,
        name: s.name || s.subject_name || '',
        code: s.code || s.subject_code || '',
        className: s.class_name || s.className || '',
        teacher: s.teacher || s.teacher_name || '',
        type: s.type || 'Core'
      })))
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", code: "", className: "", teacher: "", type: "Core" })

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
    const matchesClass = filterClass === "all" || item.className === filterClass
    return matchesSearch && matchesClass
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ name: "", code: "", className: "", teacher: "", type: "Core" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ name: item.name, code: item.code, className: item.className, teacher: item.teacher, type: item.type })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return
    try {
      await deleteSubject(id)
      setData(data.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting subject:', error)
      alert('Failed to delete subject')
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.code || !formData.className || !formData.teacher) {
      alert("Please fill all fields")
      return
    }

    setSaving(true)
    try {
      const payload = {
        subject_name: formData.name,
        subject_code: formData.code,
        class_name: formData.className,
        teacher_name: formData.teacher,
        type: formData.type
      }

      if (editingId) {
        await updateSubject(editingId, payload)
        setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
      } else {
        const res = await createSubject(payload)
        const newSubject = res.data
        setData([
          ...data,
          {
            id: newSubject.id || newSubject._id || Math.max(...data.map((d) => d.id), 0) + 1,
            ...formData,
          },
        ])
      }

      setIsDialogOpen(false)
      setFormData({ name: "", code: "", className: "", teacher: "", type: "Core" })
    } catch (error) {
      console.error('Error saving subject:', error)
      alert('Failed to save subject')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading subjects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-gray-500">Manage school subjects and curriculum</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="pl-8 border w-full p-2 rounded-md"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Class */}
          <select
            className="border p-2 rounded-md"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Subject Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Teacher</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No subjects found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.code}</td>
                  <td className="p-3">{item.className}</td>
                  <td className="p-3">{item.teacher}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.type === "Core" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded hover:bg-gray-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Subject" : "Add New Subject"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block mb-1">Subject Name</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label className="block mb-1">Subject Code</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., MATH101"
                />
              </div>

              <div>
                <label className="block mb-1">Class</label>
                <select
                  className="border p-2 rounded w-full"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                >
                  <option value="">Select Class</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Teacher Name</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="e.g., Dr. Sharma"
                />
              </div>

              <div>
                <label className="block mb-1">Type</label>
                <select
                  className="border p-2 rounded w-full"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                  onClick={handleSave}
                >
                  {saving ? 'Saving...' : (editingId ? "Update" : "Add")} Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
