import React, { useState } from 'react'

// Single-file React component (JavaScript) — UI only, responsive, TailwindCSS
// Paste this into a React project (e.g. create-react-app) and ensure Tailwind is configured.

export default function AddStudentUI() {
  const [showModal, setShowModal] = useState(false)
  const [query, setQuery] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [students, setStudents] = useState([
    { id: 's1', name: 'Aman Kumar', roll: '01', age: '15', classId: 'c1' },
    { id: 's2', name: 'Riya Singh', roll: '02', age: '14', classId: 'c2' },
    { id: 's3', name: 'Vikram Patel', roll: '03', age: '15', classId: 'c1' },
  ])
  const [classes] = useState([
    { id: 'c1', name: '10-A' },
    { id: 'c2', name: '9-B' },
  ])

  // temp form state (UI only)
  const [form, setForm] = useState({ name: '', roll: '', age: '', classId: '' })

  function initials(name) {
    return (name || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
  }

  function filteredStudents() {
    return students.filter((s) => {
      const q = query.trim().toLowerCase()
      const matchesQ = !q || `${s.name} ${s.roll}`.toLowerCase().includes(q)
      const matchesClass = !filterClass || s.classId === filterClass
      return matchesQ && matchesClass
    })
  }

  function addDemoStudent(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setStudents(prev => [{ ...form, id: Math.random().toString(36).slice(2, 8) }, ...prev])
    setForm({ name: '', roll: '', age: '', classId: '' })
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Students</h1>
            <p className="text-sm text-gray-500 mt-1">Responsive UI — search, filter & add (UI only)</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none w-full sm:w-auto">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students, e.g. Aman"
                  className="w-full sm:w-64 border-2 border-indigo-100 focus:border-indigo-300 rounded-lg pl-10 pr-4 py-2 text-sm placeholder-gray-400"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" /></svg>
              </div>
            </div>

            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="border rounded-lg p-2 text-sm">
              <option value="">All classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <button onClick={() => { setQuery(''); setFilterClass('') }} className="px-3 py-2 bg-gray-100 rounded-lg text-sm">Reset</button>

            <button onClick={() => setShowModal(true)} className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow text-sm">Add Student</button>
          </div>
        </div>

        {/* Layout: list card */}
        <div className="bg-white border rounded-2xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-800">{filteredStudents().length}</span> students</div>
            <div className="text-sm text-gray-500">Last updated: just now</div>
          </div>

          <div className="p-4">
            <ul className="space-y-3">
              {filteredStudents().length === 0 && (
                <li className="text-sm text-gray-500 p-6 text-center">No students found. Click <span className="font-semibold">Add Student</span> to create one.</li>
              )}

              {filteredStudents().map((s) => (
                <li key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-medium">{initials(s.name)}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.roll ? `Roll: ${s.roll}` : ''} {s.age ? ` • Age: ${s.age}` : ''}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <div className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">{(classes.find(c => c.id === s.classId) || {}).name || '—'}</div>
                    <div className="flex items-center gap-2">
                      <button className="text-sm bg-white border px-3 py-1 rounded">Edit</button>
                      <button className="text-sm bg-red-50 text-red-600 border px-3 py-1 rounded">Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Student</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={addDemoStudent} className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded p-2 text-sm" placeholder="Name" />

              <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} className="w-full border rounded p-2 text-sm">
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <div className="flex gap-2">
                <input value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} placeholder="Roll" className="w-1/2 border rounded p-2 text-sm" />
                <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" className="w-1/2 border rounded p-2 text-sm" />
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-indigo-600 text-white rounded py-2 text-sm">Add</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 rounded py-2 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
