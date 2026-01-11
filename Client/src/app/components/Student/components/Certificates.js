import { useState } from "react"
import { Plus, Search, Download, Eye, FileText, Award, Printer } from "lucide-react"

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([
    { id: 1, studentName: "Arjun Kumar", rollNo: "101", class: "Class 10", section: "A", type: "Character Certificate", issueDate: "2024-12-10", status: "Issued", certNo: "CC-2024-001" },
    { id: 2, studentName: "Priya Sharma", rollNo: "102", class: "Class 10", section: "A", type: "Bonafide Certificate", issueDate: "2024-12-08", status: "Issued", certNo: "BC-2024-001" },
    { id: 3, studentName: "Rahul Singh", rollNo: "103", class: "Class 9", section: "B", type: "Transfer Certificate", issueDate: "2024-12-05", status: "Pending", certNo: "TC-2024-001" },
    { id: 4, studentName: "Neha Gupta", rollNo: "104", class: "Class 11", section: "A", type: "Migration Certificate", issueDate: "2024-12-01", status: "Issued", certNo: "MC-2024-001" },
  ])

  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ studentName: "", rollNo: "", class: "", section: "", type: "" })

  const certTypes = ["Character Certificate", "Bonafide Certificate", "Transfer Certificate", "Migration Certificate", "Study Certificate", "Conduct Certificate"]

  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) || c.rollNo.includes(search)
    const matchesType = !filterType || c.type === filterType
    return matchesSearch && matchesType
  })

  const handleAdd = () => {
    setFormData({ studentName: "", rollNo: "", class: "", section: "", type: "" })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.studentName || !formData.type) {
      alert("Please fill all required fields")
      return
    }
    const prefix = formData.type.split(' ').map(w => w[0]).join('')
    const newCert = {
      id: Math.max(...certificates.map(c => c.id), 0) + 1,
      ...formData,
      issueDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      certNo: `${prefix}-2024-${String(certificates.length + 1).padStart(3, '0')}`
    }
    setCertificates([...certificates, newCert])
    setIsDialogOpen(false)
  }

  const getTypeColor = (type) => {
    const colors = {
      "Character Certificate": "bg-blue-100 text-blue-700",
      "Bonafide Certificate": "bg-green-100 text-green-700",
      "Transfer Certificate": "bg-purple-100 text-purple-700",
      "Migration Certificate": "bg-orange-100 text-orange-700",
      "Study Certificate": "bg-indigo-100 text-indigo-700",
      "Conduct Certificate": "bg-pink-100 text-pink-700"
    }
    return colors[type] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and manage student certificates</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          New Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              <p className="text-xs text-gray-500">Total Certificates</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{certificates.filter(c => c.status === "Issued").length}</p>
              <p className="text-xs text-gray-500">Issued</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{certificates.filter(c => c.status === "Pending").length}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{new Set(certificates.map(c => c.type)).size}</p>
              <p className="text-xs text-gray-500">Types</p>
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
            {certTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterType("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCertificates.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No certificates found</div>
        ) : (
          filteredCertificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cert.status === "Issued" ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {cert.status}
                </span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${getTypeColor(cert.type)}`}>{cert.type}</span>
              <h3 className="font-semibold text-gray-900">{cert.studentName}</h3>
              <p className="text-sm text-gray-500">Roll No: {cert.rollNo} | {cert.class} - {cert.section}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Certificate No</p>
                  <p className="text-sm font-mono text-gray-600">{cert.certNo}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4 text-gray-500" /></button>
                  <button className="p-2 rounded-lg hover:bg-indigo-50"><Printer className="w-4 h-4 text-indigo-500" /></button>
                  <button className="p-2 rounded-lg hover:bg-green-50"><Download className="w-4 h-4 text-green-500" /></button>
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
              <h2 className="text-xl font-bold">Generate New Certificate</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type *</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="">Select Type</option>
                  {certTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
