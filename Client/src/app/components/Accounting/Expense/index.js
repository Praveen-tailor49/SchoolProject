import { useState } from "react"
import { Plus, Edit2, Trash2, Search, TrendingDown, Calendar, IndianRupee, Filter } from "lucide-react"

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([
    { id: 1, title: "Electricity Bill", category: "Utilities", amount: 25000, date: "2024-12-15", paidTo: "State Electricity Board", paymentMode: "Online", status: "Paid", description: "Monthly electricity bill" },
    { id: 2, title: "Staff Salary", category: "Salary", amount: 450000, date: "2024-12-01", paidTo: "Staff Members", paymentMode: "Bank Transfer", status: "Paid", description: "December salary" },
    { id: 3, title: "Stationery Purchase", category: "Supplies", amount: 15000, date: "2024-12-10", paidTo: "ABC Stationery", paymentMode: "Cash", status: "Paid", description: "Notebooks, pens, etc." },
    { id: 4, title: "Building Maintenance", category: "Maintenance", amount: 35000, date: "2024-12-12", paidTo: "XYZ Contractors", paymentMode: "Cheque", status: "Pending", description: "Quarterly maintenance" },
  ])

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", category: "", amount: "", date: "", paidTo: "", paymentMode: "Cash", description: "" })

  const categories = ["Salary", "Utilities", "Supplies", "Maintenance", "Transport", "Events", "Other"]

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !filterCategory || e.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0)
  const paidExpense = expenses.filter(e => e.status === "Paid").reduce((sum, e) => sum + e.amount, 0)

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ title: "", category: "", amount: "", date: "", paidTo: "", paymentMode: "Cash", description: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ title: item.title, category: item.category, amount: item.amount, date: item.date, paidTo: item.paidTo, paymentMode: item.paymentMode, description: item.description })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter((e) => e.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.title || !formData.category || !formData.amount) {
      alert("Please fill all required fields")
      return
    }
    if (editingId) {
      setExpenses(expenses.map((e) => (e.id === editingId ? { ...e, ...formData, amount: Number(formData.amount) } : e)))
    } else {
      setExpenses([...expenses, { id: Math.max(...expenses.map((e) => e.id), 0) + 1, ...formData, amount: Number(formData.amount), status: "Paid" }])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage school expenses</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">₹{(totalExpense/100000).toFixed(1)}L</p>
              <p className="text-xs text-gray-500">Total Expense</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">₹{(paidExpense/100000).toFixed(1)}L</p>
              <p className="text-xs text-gray-500">Paid</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">₹{((totalExpense-paidExpense)/1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
              <p className="text-xs text-gray-500">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterCategory("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Expense</th>
                <th className="text-left p-4 font-medium text-gray-600">Category</th>
                <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Paid To</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No expenses found</td></tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{expense.title}</p>
                      <p className="text-xs text-gray-500">{expense.description}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{expense.category}</span>
                    </td>
                    <td className="p-4 font-semibold text-red-600">₹{expense.amount.toLocaleString()}</td>
                    <td className="p-4 text-gray-600">{expense.date}</td>
                    <td className="p-4 text-gray-600">{expense.paidTo}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${expense.status === "Paid" ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(expense)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => handleDelete(expense.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Expense" : "Add New Expense"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select</option>
                    {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid To</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.paidTo} onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-200 p-2.5 rounded-lg" rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
