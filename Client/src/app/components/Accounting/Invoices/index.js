import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Search, FileText, Download, Eye, Filter, IndianRupee, Calendar, User, Loader2 } from "lucide-react"
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from "../../../../services/apiService"

const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

export default function InvoicesPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const res = await getInvoices()
      const invoices = res.data || []
      setData(invoices.map(inv => ({
        id: inv.id || inv._id || inv.invoice_id,
        studentName: inv.student_name || inv.studentName || '',
        class: inv.class_name || inv.class || '',
        section: inv.section || '',
        amount: inv.amount || inv.total_amount || 0,
        paidAmount: inv.paid_amount || inv.paidAmount || 0,
        dueDate: inv.due_date || inv.dueDate || '',
        status: inv.status || 'Unpaid',
        createdAt: inv.created_at || inv.createdAt || new Date().toISOString().split('T')[0],
        type: inv.type || inv.fee_type || 'Tuition Fee'
      })))
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewInvoice, setViewInvoice] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ studentName: "", class: "", section: "", amount: 0, paidAmount: 0, dueDate: "", type: "Tuition Fee" })

  const filteredData = data.filter((item) => {
    const matchesSearch = item.studentName.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !filterStatus || item.status === filterStatus
    const matchesClass = !filterClass || item.class === filterClass
    return matchesSearch && matchesStatus && matchesClass
  })

  const totalAmount = data.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = data.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const pendingAmount = totalAmount - paidAmount

  const statusColors = {
    "Paid": "bg-green-100 text-green-700",
    "Partial": "bg-yellow-100 text-yellow-700",
    "Unpaid": "bg-red-100 text-red-700",
    "Overdue": "bg-red-200 text-red-800",
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ studentName: "", class: "", section: "", amount: 0, paidAmount: 0, dueDate: "", type: "Tuition Fee" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ studentName: item.studentName, class: item.class, section: item.section, amount: item.amount, paidAmount: item.paidAmount, dueDate: item.dueDate, type: item.type })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id)
        setData(data.filter((item) => item.id !== id))
      } catch (error) {
        console.error('Error deleting invoice:', error)
        alert('Failed to delete invoice')
      }
    }
  }

  const getStatus = (amount, paidAmount, dueDate) => {
    if (paidAmount >= amount) return "Paid"
    if (new Date(dueDate) < new Date() && paidAmount < amount) return "Overdue"
    if (paidAmount > 0) return "Partial"
    return "Unpaid"
  }

  const handleSave = async () => {
    if (!formData.studentName || !formData.class || !formData.amount) {
      alert("Please fill all required fields")
      return
    }

    setSaving(true)
    try {
      const status = getStatus(formData.amount, formData.paidAmount, formData.dueDate)
      const payload = {
        student_name: formData.studentName,
        class_name: formData.class,
        section: formData.section,
        total_amount: formData.amount,
        paid_amount: formData.paidAmount,
        due_date: formData.dueDate,
        fee_type: formData.type,
        status
      }

      if (editingId) {
        await updateInvoice(editingId, payload)
        setData(data.map((item) => (item.id === editingId ? { ...item, ...formData, status } : item)))
      } else {
        const res = await createInvoice(payload)
        const newInvoice = res.data
        const newId = newInvoice.id || newInvoice._id || `INV-${String(data.length + 1).padStart(3, "0")}`
        setData([...data, { id: newId, ...formData, status, createdAt: new Date().toISOString().split("T")[0] }])
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-500">Loading invoices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Manage student fee invoices and payments</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Collected</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{paidAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-red-600 mt-1">₹{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="Search by student name or invoice ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">All Classes</option>
            {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterClass("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            Reset
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No invoices found</td></tr>
              ) : (
                filteredData.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-900">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.studentName}</p>
                        <p className="text-sm text-gray-500">{invoice.class} - {invoice.section}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.type}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-green-600">₹{invoice.paidAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(invoice.dueDate).toLocaleDateString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewInvoice(invoice)} className="p-2 rounded-lg hover:bg-gray-100 transition-all" title="View">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleEdit(invoice)} className="p-2 rounded-lg hover:bg-gray-100 transition-all" title="Edit">
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all" title="Download">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(invoice.id)} className="p-2 rounded-lg hover:bg-red-50 transition-all" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Invoice" : "Create New Invoice"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} placeholder="Enter student name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })}>
                    <option value="">Select Class</option>
                    {CLASSES.map((cls) => (<option key={cls} value={cls}>{cls}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })}>
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Transport Fee">Transport Fee</option>
                  <option value="Library Fee">Library Fee</option>
                  <option value="Lab Fee">Lab Fee</option>
                  <option value="Sports Fee">Sports Fee</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount *</label>
                  <input type="number" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })} placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                  <input type="number" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.paidAmount} onChange={(e) => setFormData({ ...formData, paidAmount: parseInt(e.target.value) || 0 })} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50" onClick={handleSave}>{saving ? 'Saving...' : (editingId ? "Update" : "Create")} Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Invoice Details</h2>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[viewInvoice.status]}`}>
                {viewInvoice.status}
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-gray-100">
                <p className="text-2xl font-bold text-indigo-600">{viewInvoice.id}</p>
                <p className="text-sm text-gray-500">Created on {new Date(viewInvoice.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Student</span>
                  <span className="font-medium">{viewInvoice.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Class</span>
                  <span className="font-medium">{viewInvoice.class} - {viewInvoice.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee Type</span>
                  <span className="font-medium">{viewInvoice.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date</span>
                  <span className="font-medium">{new Date(viewInvoice.dueDate).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold">₹{viewInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Paid</span>
                    <span className="font-medium">₹{viewInvoice.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Balance</span>
                    <span className="font-medium">₹{(viewInvoice.amount - viewInvoice.paidAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2" onClick={() => setViewInvoice(null)}>
                Close
              </button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
