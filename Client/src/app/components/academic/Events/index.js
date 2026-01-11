import { useState } from "react"
import { Plus, Edit2, Trash2, Search, Calendar, Clock, MapPin, Users } from "lucide-react"

export default function EventsPage() {
  const [data, setData] = useState([
    { id: 1, title: "Annual Sports Day", description: "Annual sports competition for all students", date: "2024-12-25", time: "09:00 AM", venue: "School Ground", organizer: "Sports Dept", category: "Sports", attendees: 500, status: "Upcoming" },
    { id: 2, title: "Parent-Teacher Meeting", description: "Quarterly PTM for all classes", date: "2024-12-22", time: "10:00 AM", venue: "School Auditorium", organizer: "Admin", category: "Meeting", attendees: 200, status: "Upcoming" },
    { id: 3, title: "Science Exhibition", description: "Students showcase their science projects", date: "2024-12-18", time: "11:00 AM", venue: "Science Lab", organizer: "Science Dept", category: "Exhibition", attendees: 150, status: "Upcoming" },
    { id: 4, title: "Republic Day Celebration", description: "Flag hoisting and cultural program", date: "2025-01-26", time: "08:00 AM", venue: "School Ground", organizer: "Admin", category: "Cultural", attendees: 600, status: "Upcoming" },
  ])

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", description: "", date: "", time: "", venue: "", organizer: "", category: "" })

  const categories = ["Sports", "Cultural", "Meeting", "Exhibition", "Competition", "Holiday", "Other"]

  const filteredData = data.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  const handleAdd = () => {
    setEditingId(null)
    setFormData({ title: "", description: "", date: "", time: "", venue: "", organizer: "", category: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({ title: item.title, description: item.description, date: item.date, time: item.time, venue: item.venue, organizer: item.organizer, category: item.category })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setData(data.filter((item) => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.venue) {
      alert("Please fill all required fields")
      return
    }
    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)))
    } else {
      setData([...data, { id: Math.max(...data.map((d) => d.id), 0) + 1, ...formData, attendees: 0, status: "Upcoming" }])
    }
    setIsDialogOpen(false)
  }

  const getCategoryColor = (category) => {
    const colors = {
      "Sports": "bg-green-100 text-green-700",
      "Cultural": "bg-purple-100 text-purple-700",
      "Meeting": "bg-blue-100 text-blue-700",
      "Exhibition": "bg-orange-100 text-orange-700",
      "Competition": "bg-red-100 text-red-700",
      "Holiday": "bg-pink-100 text-pink-700",
      "Other": "bg-gray-100 text-gray-700"
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">Manage school events and activities</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          Add New Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">Total Events</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => new Date(d.date) >= new Date()).length}</p>
              <p className="text-xs text-gray-500">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.reduce((sum, d) => sum + d.attendees, 0)}</p>
              <p className="text-xs text-gray-500">Expected Attendees</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => { const eventDate = new Date(d.date); const today = new Date(); return eventDate.getMonth() === today.getMonth() }).length}</p>
              <p className="text-xs text-gray-500">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
          <button onClick={() => { setSearch(""); setFilterCategory("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">Reset</button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No events found</div>
        ) : (
          filteredData.map((event) => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>{event.category}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(event)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{event.date}</span></div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{event.time}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{event.venue}</span></div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">By {event.organizer}</span>
                  <span className="flex items-center gap-1 text-sm text-gray-500"><Users className="w-4 h-4" /> {event.attendees}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingId ? "Edit Event" : "Add New Event"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter event title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-200 p-2.5 rounded-lg" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter event description"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} placeholder="Enter venue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-lg" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} placeholder="Enter organizer name" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50" onClick={() => setIsDialogOpen(false)}>Cancel</button>
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg" onClick={handleSave}>{editingId ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
