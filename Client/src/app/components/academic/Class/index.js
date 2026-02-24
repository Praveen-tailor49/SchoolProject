import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react"
import { getClasses, createClass, updateClass, deleteClass } from "../../../../services/apiService"

const CLASSES = [
  "Class 1","Class 2","Class 3","Class 4","Class 5","Class 6",
  "Class 7","Class 8","Class 9","Class 10","Class 11","Class 12",
]

const SECTIONS = ["A", "B", "C", "D", "E"]

export default function ClassPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const res = await getClasses()
      const classes = res || [] // Backend returns data directly, not in res.data
      setData(classes.map(c => ({
        id: c.class_id || c.id, // Use class_id from database
        className: c.class_name || c.className || '',
        section: c.section || '',
        capacity: c.capacity || 0,
        students: c.students_count || c.student_count || 0
      })))
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterSection, setFilterSection] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ className: "", section: "", capacity: 0 })

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.className.toLowerCase().includes(search.toLowerCase()) ||
      item.section.toLowerCase().includes(search.toLowerCase())

    const matchesClass = !filterClass || item.className === filterClass
    const matchesSection = !filterSection || item.section === filterSection

    return matchesSearch && matchesClass && matchesSection
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ className: "", section: "", capacity: 0 })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ className: item.className, section: item.section, capacity: item.capacity })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return
    try {
      await deleteClass(id)
      // Refresh data from server instead of local filtering
      fetchClasses()
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Failed to delete class')
    }
  }

  const handleSave = async () => {
    if (!formData.className || !formData.section || formData.capacity === 0) {
      alert("Please fill all fields")
      return
    }

    setSaving(true)
    try {
      const payload = {
        class_name: formData.className,
        section: formData.section,
        capacity: formData.capacity
      }

      if (editingId) {
        await updateClass(editingId, payload)
        // Refresh data from server to get updated values
        fetchClasses()
      } else {
        await createClass(payload)
        // Refresh data from server to get the new class
        fetchClasses()
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving class:', error)
      alert('Failed to save class')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Classes & Sections</h1>
          <p className="text-gray-500">Manage all class sections and their capacity</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
            <input
              className="pl-8 border w-full p-2 rounded-md"
              placeholder="Search..."
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
            <option value="">Filter by Class</option>
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          {/* Filter Section */}
          <select
            className="border p-2 rounded-md"
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
          >
            <option value="">Filter by Section</option>
            {SECTIONS.map((sec) => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Students</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No classes found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.className}</td>
                  <td className="p-3">Section {item.section}</td>
                  <td className="p-3">{item.capacity}</td>
                  <td className="p-3">{item.students}</td>
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Section" : "Add New Section"}
            </h2>

            <div className="mb-3">
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

            <div className="mb-3">
              <label className="block mb-1">Section</label>
              <select
                className="border p-2 rounded w-full"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              >
                <option value="">Select Section</option>
                {SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-1">Capacity</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              />
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
                {saving ? 'Saving...' : (editingId ? "Update" : "Add")} Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
