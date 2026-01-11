import { useState, useEffect } from "react"
import { Plus, Search, IndianRupee, Calendar, CreditCard, Banknote, Smartphone, TrendingUp, Download, Filter, CheckCircle, Loader2 } from "lucide-react"
import { getPayments, createPayment } from "../../../../services/apiService"

export default function PaymentsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const res = await getPayments()
      const payments = res.data || []
      setData(payments.map(p => ({
        id: p.id || p._id || p.payment_id,
        invoiceId: p.invoice_id || p.invoiceId || '',
        studentName: p.student_name || p.studentName || '',
        class: p.class_name || p.class || '',
        amount: p.amount || 0,
        method: p.method || p.payment_method || 'Cash',
        date: p.date || p.payment_date || new Date().toISOString().split('T')[0],
        status: p.status || 'Completed',
        reference: p.reference || p.reference_number || ''
      })))
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const [search, setSearch] = useState("")
  const [filterMethod, setFilterMethod] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ invoiceId: "", studentName: "", class: "", amount: 0, method: "Cash", reference: "" })

  const filteredData = data.filter((item) => {
    const matchesSearch = item.studentName.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()) || item.invoiceId.toLowerCase().includes(search.toLowerCase())
    const matchesMethod = !filterMethod || item.method === filterMethod
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesMethod && matchesStatus
  })

  const totalPayments = data.reduce((sum, p) => sum + p.amount, 0)
  const completedPayments = data.filter(p => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = data.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0)

  const methodIcons = {
    "Cash": <Banknote className="w-4 h-4" />,
    "Online": <CreditCard className="w-4 h-4" />,
    "UPI": <Smartphone className="w-4 h-4" />,
    "Cheque": <CreditCard className="w-4 h-4" />,
  }

  const methodColors = {
    "Cash": "bg-green-100 text-green-700",
    "Online": "bg-blue-100 text-blue-700",
    "UPI": "bg-purple-100 text-purple-700",
    "Cheque": "bg-orange-100 text-orange-700",
  }

  const handleAdd = () => {
    setFormData({ invoiceId: "", studentName: "", class: "", amount: 0, method: "Cash", reference: "" })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.studentName || !formData.amount) {
      alert("Please fill all required fields")
      return
    }

    setSaving(true)
    try {
      const payload = {
        invoice_id: formData.invoiceId,
        student_name: formData.studentName,
        class_name: formData.class,
        amount: formData.amount,
        payment_method: formData.method,
        reference_number: formData.reference,
        status: formData.method === "Cheque" ? "Pending" : "Completed"
      }

      const res = await createPayment(payload)
      const newPayment = res.data
      const newId = newPayment.id || newPayment._id || `PAY-${String(data.length + 1).padStart(3, "0")}`
      setData([...data, { id: newId, ...formData, date: new Date().toISOString().split("T")[0], status: formData.method === "Cheque" ? "Pending" : "Completed" }])
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving payment:', error)
      alert('Failed to record payment')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <p className="text-gray-500">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all fee payments</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg shadow-green-200 hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-100">Total Payments</p>
              <p className="text-2xl font-bold mt-1">₹{totalPayments.toLocaleString()}</p>
              <p className="text-xs text-indigo-200 mt-1">{data.length} transactions</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Completed</p>
              <p className="text-2xl font-bold mt-1">₹{completedPayments.toLocaleString()}</p>
              <p className="text-xs text-green-200 mt-1">{data.filter(p => p.status === "Completed").length} transactions</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100">Pending</p>
              <p className="text-2xl font-bold mt-1">₹{pendingPayments.toLocaleString()}</p>
              <p className="text-xs text-orange-200 mt-1">{data.filter(p => p.status === "Pending").length} transactions</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">This Month</p>
              <p className="text-2xl font-bold mt-1">₹{totalPayments.toLocaleString()}</p>
              <p className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
            <option value="">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No payments found</td></tr>
              ) : (
                filteredData.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{payment.id}</span>
                          <p className="text-xs text-gray-500">{payment.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.studentName}</p>
                        <p className="text-sm text-gray-500">{payment.class}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-indigo-600 font-medium">{payment.invoiceId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">₹{payment.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${methodColors[payment.method]}`}>
                        {methodIcons[payment.method]}
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${payment.status === "Completed" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Record New Payment</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.invoiceId} onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })} placeholder="e.g., INV-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} placeholder="Enter student name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} placeholder="e.g., Class 10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input type="number" className="w-full border border-gray-200 p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Cash", "Online", "UPI", "Cheque"].map((method) => (
                    <button key={method} onClick={() => setFormData({ ...formData, method })} className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${formData.method === method ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                      {methodIcons[method]}
                      <span className="text-xs font-medium">{method}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} placeholder="Transaction/Receipt number" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50" onClick={handleSave}>{saving ? 'Saving...' : 'Record Payment'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
