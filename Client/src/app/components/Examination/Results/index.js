import { useState } from "react"
import { Search, Download, Eye, TrendingUp, Award, Users } from "lucide-react"

const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

export default function ResultsPage() {
  const [results] = useState([
    { id: 1, studentName: "Arjun Kumar", rollNo: "101", class: "Class 10", section: "A", exam: "Half Yearly", totalMarks: 500, obtainedMarks: 456, percentage: 91.2, grade: "A+", rank: 1 },
    { id: 2, studentName: "Priya Sharma", rollNo: "102", class: "Class 10", section: "A", exam: "Half Yearly", totalMarks: 500, obtainedMarks: 445, percentage: 89.0, grade: "A+", rank: 2 },
    { id: 3, studentName: "Rahul Singh", rollNo: "103", class: "Class 10", section: "A", exam: "Half Yearly", totalMarks: 500, obtainedMarks: 420, percentage: 84.0, grade: "A", rank: 3 },
    { id: 4, studentName: "Neha Gupta", rollNo: "104", class: "Class 10", section: "A", exam: "Half Yearly", totalMarks: 500, obtainedMarks: 398, percentage: 79.6, grade: "B+", rank: 4 },
    { id: 5, studentName: "Amit Verma", rollNo: "105", class: "Class 10", section: "A", exam: "Half Yearly", totalMarks: 500, obtainedMarks: 375, percentage: 75.0, grade: "B", rank: 5 },
  ])

  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterExam, setFilterExam] = useState("")
  const [selectedResult, setSelectedResult] = useState(null)

  const exams = ["Half Yearly", "Unit Test - December", "Mid-Term"]

  const filteredResults = results.filter((item) => {
    const matchesSearch = item.studentName.toLowerCase().includes(search.toLowerCase()) || item.rollNo.includes(search)
    const matchesClass = !filterClass || item.class === filterClass
    const matchesExam = !filterExam || item.exam === filterExam
    return matchesSearch && matchesClass && matchesExam
  })

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-700"
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700"
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage student exam results</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{(results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Avg Percentage</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{results.filter(r => r.percentage >= 90).length}</p>
              <p className="text-xs text-gray-500">Top Performers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{results.filter(r => r.percentage >= 33).length}</p>
              <p className="text-xs text-gray-500">Pass Count</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Search by name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">All Classes</option>
            {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterExam} onChange={(e) => setFilterExam(e.target.value)}>
            <option value="">All Exams</option>
            {exams.map((exam) => (<option key={exam} value={exam}>{exam}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterClass(""); setFilterExam("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Rank</th>
                <th className="text-left p-4 font-medium text-gray-600">Student</th>
                <th className="text-left p-4 font-medium text-gray-600">Class</th>
                <th className="text-left p-4 font-medium text-gray-600">Exam</th>
                <th className="text-left p-4 font-medium text-gray-600">Marks</th>
                <th className="text-left p-4 font-medium text-gray-600">Percentage</th>
                <th className="text-left p-4 font-medium text-gray-600">Grade</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No results found</td></tr>
              ) : (
                filteredResults.map((result) => (
                  <tr key={result.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${result.rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {result.rank}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{result.studentName}</p>
                        <p className="text-xs text-gray-500">Roll No: {result.rollNo}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{result.class} - {result.section}</td>
                    <td className="p-4 text-gray-600">{result.exam}</td>
                    <td className="p-4 text-gray-600">{result.obtainedMarks}/{result.totalMarks}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${result.percentage >= 80 ? 'bg-green-500' : result.percentage >= 60 ? 'bg-blue-500' : result.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${result.percentage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{result.percentage}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>{result.grade}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelectedResult(result)} className="p-2 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4 text-gray-500" /></button>
                      <button className="p-2 rounded-lg hover:bg-indigo-50"><Download className="w-4 h-4 text-indigo-500" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Result Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {selectedResult.studentName.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedResult.studentName}</h2>
              <p className="text-gray-500">Roll No: {selectedResult.rollNo} | {selectedResult.class} - {selectedResult.section}</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">{selectedResult.exam}</p>
                <p className="text-4xl font-bold text-gray-900">{selectedResult.percentage}%</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedResult.grade)}`}>Grade: {selectedResult.grade}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-gray-900">{selectedResult.obtainedMarks}</p>
                  <p className="text-xs text-gray-500">Obtained Marks</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-gray-900">{selectedResult.totalMarks}</p>
                  <p className="text-xs text-gray-500">Total Marks</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-gray-900">#{selectedResult.rank}</p>
                  <p className="text-xs text-gray-500">Class Rank</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">Pass</p>
                  <p className="text-xs text-gray-500">Status</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setSelectedResult(null)}>Close</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
