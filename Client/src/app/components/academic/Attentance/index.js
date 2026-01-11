import { useState, useEffect } from "react"
import { Save, RotateCcw, Loader2 } from "lucide-react"
import { getStudentsByClass, markAttendance, getClasses } from "../../../../services/apiService"

const SECTIONS = ["A","B","C","D","E"]

export default function AttendancePage() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("A")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await getClasses()
      const classData = res.data || []
      const classNames = [...new Set(classData.map(c => c.class_name || c.className || ''))].filter(Boolean)
      setClasses(classNames.length > 0 ? classNames : ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"])
      if (classNames.length > 0) {
        setSelectedClass(classNames[0])
        fetchStudents(classNames[0])
      } else {
        setSelectedClass("Class 10")
        fetchStudents("Class 10")
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setClasses(["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"])
      setSelectedClass("Class 10")
      setLoading(false)
    }
  }

  const fetchStudents = async (classId) => {
    try {
      setLoading(true)
      const res = await getStudentsByClass(classId)
      const students = res.data || []
      setAttendance(students.map(s => ({
        id: s.id || s._id,
        name: s.name || s.student_name || '',
        rollNo: s.roll_number || s.rollNo || '',
        present: true
      })))
    } catch (error) {
      console.error('Error fetching students:', error)
      setAttendance([])
    } finally {
      setLoading(false)
    }
  }

  const handleClassChange = (className) => {
    setSelectedClass(className)
    fetchStudents(className)
  }

  const toggleAttendance = (id) => {
    setAttendance(attendance.map((r) => (r.id === id ? { ...r, present: !r.present } : r)))
  }

  const handleSaveAttendance = async () => {
    setSaving(true)
    try {
      const payload = {
        class_name: selectedClass,
        section: selectedSection,
        date: selectedDate,
        attendance: attendance.map(r => ({
          student_id: r.id,
          present: r.present
        }))
      }
      await markAttendance(payload)
      const presentCount = attendance.filter((r) => r.present).length
      const absentCount = attendance.filter((r) => !r.present).length
      alert(`Attendance saved for ${selectedDate}\nPresent: ${presentCount}\nAbsent: ${absentCount}`)
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const handleResetAttendance = () => {
    setAttendance(attendance.map((r) => ({ ...r, present: true })))
  }

  const presentCount = attendance.filter((r) => r.present).length
  const absentCount = attendance.filter((r) => !r.present).length

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-gray-500">View and manage student attendance records</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Class */}
        <div>
          <label className="block mb-1">Class *</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div>
          <label className="block mb-1">Section *</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            {SECTIONS.map((sec) => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1">Date *</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-gray-200 transition"
            onClick={handleResetAttendance}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{attendance.length}</div>
          <div className="text-sm text-gray-500">Total Students</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{presentCount}</div>
          <div className="text-sm text-gray-500">Present</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{absentCount}</div>
          <div className="text-sm text-gray-500">Absent</div>
        </div>
      </div>

      {/* ATTENDANCE TABLE */}
      {attendance.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No students found for this class</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Roll No</th>
                <th className="p-3 text-center">Present</th>
                <th className="p-3 text-center">Absent</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="p-3">{record.name}</td>
                  <td className="p-3">{record.rollNo}</td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={record.present}
                      onChange={() => toggleAttendance(record.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={!record.present}
                      onChange={() => toggleAttendance(record.id)}
                      className="w-4 h-4"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-4">
        <button
          disabled={saving || attendance.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          onClick={handleSaveAttendance}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  )
}
