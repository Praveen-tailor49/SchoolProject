import { useState } from "react"
import { Printer, Download, Palette } from "lucide-react"

const MOCK_STUDENTS = [
  { id: "001", name: "Arjun Kumar", rollNo: "S001", class: "Class 10", section: "A", dob: "05/01/2009", phone: "(555) 123-4567", photo: "/diverse-students.png" },
  { id: "002", name: "Priya Singh", rollNo: "S002", class: "Class 10", section: "A", dob: "12/03/2009", phone: "(555) 234-5678", photo: "/diverse-students.png" },
  { id: "003", name: "Rahul Patel", rollNo: "S003", class: "Class 9", section: "B", dob: "08/15/2010", phone: "(555) 345-6789", photo: "/diverse-students.png" },
]

const PRESET_THEMES = {
  blue: { name: "Blue Professional", backgroundColor: "#1e40af", textColor: "#ffffff", headerColor: "#1e3a8a" },
  green: { name: "Green Modern", backgroundColor: "#059669", textColor: "#ffffff", headerColor: "#047857" },
  purple: { name: "Purple Elegant", backgroundColor: "#7c3aed", textColor: "#ffffff", headerColor: "#6d28d9" },
  teal: { name: "Teal Fresh", backgroundColor: "#14b8a6", textColor: "#1f2937", headerColor: "#0d9488" },
}

const CARD_SIZES = {
  small: { width: 280, height: 160 },
  medium: { width: 320, height: 192 },
  large: { width: 400, height: 240 },
}

export default function IdCardsPage() {
  const [activeTab, setActiveTab] = useState("filter")
  const [cardSize, setCardSize] = useState("medium")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSection, setSelectedSection] = useState("all")
  const [customization, setCustomization] = useState({
    backgroundColor: "#1e40af",
    headerColor: "#1e3a8a",
    textColor: "#ffffff",
    cardWidth: 320,
    cardHeight: 192,
  })

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) => (selectedClass === "all" || s.class === selectedClass) && (selectedSection === "all" || s.section === selectedSection)
  )

  const handlePrint = () => window.print()
  const handleSizeChange = (size) => {
    setCardSize(size)
    if (CARD_SIZES[size]) {
      setCustomization((prev) => ({ ...prev, cardWidth: CARD_SIZES[size].width, cardHeight: CARD_SIZES[size].height }))
    }
  }
  const applyPreset = (preset) => setCustomization((prev) => ({ ...prev, ...preset }))

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Student ID Cards</h1>
          <p className="text-gray-500 text-sm">Generate and manage student identification cards with custom styling</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100 transition">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-100 transition">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-300 flex w-full max-w-md">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "filter" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("filter")}
        >
          Filters
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "customize" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("customize")}
        >
          Customize
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "filter" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Size</label>
            <select value={cardSize} onChange={(e) => handleSizeChange(e.target.value)} className="w-full border p-2 rounded">
              <option value="small">Small (280×160)</option>
              <option value="medium">Medium (320×192)</option>
              <option value="large">Large (400×240)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full border p-2 rounded">
              <option value="all">All Classes</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full border p-2 rounded">
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <div className="mb-4 space-y-4">
          {/* Presets */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Preset Themes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(PRESET_THEMES).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(preset)}
                  className="p-2 rounded border hover:border-gray-500 transition"
                  title={preset.name}
                >
                  <div className="w-full h-12 rounded mb-1" style={{ backgroundColor: preset.backgroundColor }} />
                  <p className="text-xs text-center truncate">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["backgroundColor", "headerColor", "textColor"].map((colorKey) => (
              <div key={colorKey}>
                <label className="block text-xs font-medium mb-1 capitalize">{colorKey.replace("Color", " Color")}</label>
                <input
                  type="color"
                  value={customization[colorKey]}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, [colorKey]: e.target.value }))}
                  className="w-12 h-10 cursor-pointer mb-1"
                />
                <input
                  type="text"
                  value={customization[colorKey]}
                  onChange={(e) => setCustomization((prev) => ({ ...prev, [colorKey]: e.target.value }))}
                  className="w-full border p-1 rounded text-xs"
                />
              </div>
            ))}
          </div>

          {/* Custom Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Width: {customization.cardWidth}px</label>
              <input
                type="range"
                min={240}
                max={500}
                step={10}
                value={customization.cardWidth}
                onChange={(e) => setCustomization((prev) => ({ ...prev, cardWidth: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Height: {customization.cardHeight}px</label>
              <input
                type="range"
                min={120}
                max={320}
                step={10}
                value={customization.cardHeight}
                onChange={(e) => setCustomization((prev) => ({ ...prev, cardHeight: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* ID Cards */}
      <p className="text-sm text-gray-500 mb-2">Showing {filteredStudents.length} card(s)</p>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${customization.cardWidth}px, 1fr))` }}>
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="rounded-xl shadow-lg overflow-hidden flex flex-col transition-all"
            style={{ width: customization.cardWidth, height: customization.cardHeight, backgroundColor: customization.backgroundColor }}
          >
            {/* Header */}
            <div className="px-2 py-1 flex justify-between" style={{ backgroundColor: customization.headerColor, color: customization.textColor }}>
              <h3 className="font-bold text-sm">STUDENT ID</h3>
              <span className="text-xs opacity-80">{new Date().getFullYear()}–{new Date().getFullYear() + 1}</span>
            </div>
            {/* Body */}
            <div className="flex flex-1 p-2 gap-2 overflow-hidden" style={{ backgroundColor: `${customization.backgroundColor}20` }}>
              <img src={student.photo} alt={student.name} className="w-20 h-24 object-cover rounded border-2" style={{ borderColor: customization.headerColor }} />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <p className="font-semibold text-sm truncate" style={{ color: customization.textColor }}>{student.name}</p>
                  <p className="text-xs" style={{ color: customization.textColor }}><span className="font-semibold">Roll:</span> {student.rollNo}</p>
                  <p className="text-xs" style={{ color: customization.textColor }}><span className="font-semibold">Class:</span> {student.class}-{student.section}</p>
                  <p className="text-xs" style={{ color: customization.textColor }}><span className="font-semibold">DOB:</span> {student.dob}</p>
                </div>
                <p className="text-xs border-t pt-1 truncate" style={{ color: customization.textColor, borderColor: customization.headerColor }}>
                  <span className="font-semibold">Ph:</span> {student.phone}
                </p>
              </div>
            </div>
            {/* Footer */}
            <div className="px-2 py-1 flex justify-between text-xs font-mono font-bold" style={{ backgroundColor: customization.headerColor, color: customization.textColor }}>
              <span>{student.id}</span>
              <span className="opacity-80">School Logo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
