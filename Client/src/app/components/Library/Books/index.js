import { useState } from "react"
import { Plus, Edit2, Trash2, Search, BookOpen, Library, Tag, User } from "lucide-react"

export default function BooksPage() {
  const [books, setBooks] = useState([
    { id: 1, title: "Mathematics for Class 10", author: "R.D. Sharma", isbn: "978-81-7709-001-1", category: "Mathematics", copies: 25, available: 18, shelf: "A-101", status: "Available" },
    { id: 2, title: "Physics NCERT Class 12", author: "NCERT", isbn: "978-81-7450-001-2", category: "Science", copies: 30, available: 22, shelf: "B-201", status: "Available" },
    { id: 3, title: "English Grammar", author: "Wren & Martin", isbn: "978-93-5253-001-3", category: "English", copies: 20, available: 5, shelf: "C-101", status: "Low Stock" },
    { id: 4, title: "History of India", author: "Bipin Chandra", isbn: "978-81-2500-001-4", category: "History", copies: 15, available: 0, shelf: "D-301", status: "Out of Stock" },
    { id: 5, title: "Computer Science with Python", author: "Sumita Arora", isbn: "978-93-8717-001-5", category: "Computer", copies: 20, available: 12, shelf: "E-101", status: "Available" },
  ])

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", author: "", isbn: "", category: "", copies: "", shelf: "" })

  const categories = ["Mathematics", "Science", "English", "Hindi", "History", "Geography", "Computer", "General"]

  const filteredBooks = books.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !filterCategory || b.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ title: "", author: "", isbn: "", category: "", copies: "", shelf: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ title: item.title, author: item.author, isbn: item.isbn, category: item.category, copies: item.copies, shelf: item.shelf })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((b) => b.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.title || !formData.author || !formData.category) {
      alert("Please fill all required fields")
      return
    }
    const copies = Number(formData.copies) || 1
    if (editingId) {
      setBooks(books.map((b) => (b.id === editingId ? { ...b, ...formData, copies, available: copies } : b)))
    } else {
      setBooks([...books, { 
        id: Math.max(...books.map((b) => b.id), 0) + 1, 
        ...formData, 
        copies,
        available: copies,
        status: "Available"
      }])
    }
    setIsDialogOpen(false)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Available": return "bg-green-100 text-green-700"
      case "Low Stock": return "bg-orange-100 text-orange-700"
      case "Out of Stock": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const totalBooks = books.reduce((sum, b) => sum + b.copies, 0)
  const availableBooks = books.reduce((sum, b) => sum + b.available, 0)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library Books</h1>
          <p className="text-gray-500 text-sm mt-1">Manage library book inventory</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Library className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
              <p className="text-xs text-gray-500">Total Books</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{availableBooks}</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              <p className="text-xs text-gray-500">Titles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalBooks - availableBooks}</p>
              <p className="text-xs text-gray-500">Issued</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Search by title or author..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterCategory("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Book</th>
                <th className="text-left p-4 font-medium text-gray-600">ISBN</th>
                <th className="text-left p-4 font-medium text-gray-600">Category</th>
                <th className="text-left p-4 font-medium text-gray-600">Copies</th>
                <th className="text-left p-4 font-medium text-gray-600">Shelf</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No books found</td></tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3" /> {book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{book.isbn}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{book.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900 font-medium">{book.available}</span>
                      <span className="text-gray-400">/{book.copies}</span>
                    </td>
                    <td className="p-4 text-gray-600">{book.shelf}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>{book.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(book)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => handleDelete(book.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Book" : "Add New Book"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copies</label>
                  <input type="number" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.copies} onChange={(e) => setFormData({ ...formData, copies: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Location</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.shelf} onChange={(e) => setFormData({ ...formData, shelf: e.target.value })} placeholder="e.g., A-101" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
