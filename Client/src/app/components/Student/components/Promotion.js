import { useState } from "react"
import { Search, ArrowUpRight, CheckCircle, Users, AlertCircle } from "lucide-react"

const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

export default function PromotionPage() {
  const [students, setStudents] = useState([
    { id: 1, name: "Arjun Kumar", rollNo: "101", currentClass: "Class 9", section: "A", percentage: 85, status: "Eligible", selected: false },
    { id: 2, name: "Priya Sharma", rollNo: "102", currentClass: "Class 9", section: "A", percentage: 78, status: "Eligible", selected: false },
    { id: 3, name: "Rahul Singh", rollNo: "103", currentClass: "Class 9", section: "A", percentage: 45, status: "Eligible", selected: false },
    { id: 4, name: "Neha Gupta", rollNo: "104", currentClass: "Class 9", section: "A", percentage: 28, status: "Not Eligible", selected: false },
    { id: 5, name: "Amit Verma", rollNo: "105", currentClass: "Class 9", section: "B", percentage: 92, status: "Eligible", selected: false },
    { id: 6, name: "Sneha Patel", rollNo: "106", currentClass: "Class 9", section: "B", percentage: 67, status: "Eligible", selected: false },
  ])

  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterSection, setFilterSection] = useState("")
  const [promoteToClass, setPromoteToClass] = useState("")
  const [selectAll, setSelectAll] = useState(false)

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.includes(search)
    const matchesClass = !filterClass || s.currentClass === filterClass
    const matchesSection = !filterSection || s.section === filterSection
    return matchesSearch && matchesClass && matchesSection
  })

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setStudents(students.map(s => ({ ...s, selected: newSelectAll && s.status === "Eligible" })))
  }

  const handleSelect = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, selected: !s.selected } : s))
  }

  const handlePromote = () => {
    if (!promoteToClass) {
      alert("Please select the class to promote to")
      return
    }
    const selectedCount = students.filter(s => s.selected).length
    if (selectedCount === 0) {
      alert("Please select students to promote")
      return
    }
    if (window.confirm(`Are you sure you want to promote ${selectedCount} students to ${promoteToClass}?`)) {
      setStudents(students.map(s => s.selected ? { ...s, currentClass: promoteToClass, selected: false } : s))
      alert(`${selectedCount} students promoted successfully!`)
    }
  }

  const selectedCount = students.filter(s => s.selected).length
  const eligibleCount = filteredStudents.filter(s => s.status === "Eligible").length

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Promotion</h1>
          <p className="text-gray-500 text-sm mt-1">Promote students to next class</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{eligibleCount}</p>
              <p className="text-xs text-gray-500">Eligible</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredStudents.length - eligibleCount}</p>
              <p className="text-xs text-gray-500">Not Eligible</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{selectedCount}</p>
              <p className="text-xs text-gray-500">Selected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">Current Class</option>
            {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
            <option value="">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg bg-indigo-50 border-indigo-200" value={promoteToClass} onChange={(e) => setPromoteToClass(e.target.value)}>
            <option value="">Promote To</option>
            {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
          </select>
          <button onClick={handlePromote} disabled={selectedCount === 0} className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Promote ({selectedCount})
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th className="text-left p-4 font-medium text-gray-600">Student</th>
                <th className="text-left p-4 font-medium text-gray-600">Roll No</th>
                <th className="text-left p-4 font-medium text-gray-600">Current Class</th>
                <th className="text-left p-4 font-medium text-gray-600">Percentage</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No students found</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={`border-b border-gray-50 hover:bg-gray-50 ${student.selected ? 'bg-indigo-50' : ''}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded" 
                        checked={student.selected} 
                        onChange={() => handleSelect(student.id)}
                        disabled={student.status !== "Eligible"}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{student.rollNo}</td>
                    <td className="p-4 text-gray-600">{student.currentClass} - {student.section}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${student.percentage >= 60 ? 'bg-green-500' : student.percentage >= 33 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${student.percentage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{student.percentage}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${student.status === "Eligible" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
