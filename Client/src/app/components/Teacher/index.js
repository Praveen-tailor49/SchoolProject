import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Edit2, Trash2, Search, GraduationCap, Mail, Phone, BookOpen, Calendar, Loader2 } from "lucide-react"
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "../../../services/apiService"
import { useTranslation } from "../../contexts/LanguageContext"

const SUBJECTS = ["Mathematics", "English", "Science", "Hindi", "Social Studies", "Computer Science", "Physics", "Chemistry", "Biology"]
const CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]

const DESIGNATIONS = [
  "प्रधानाचार्य (Principal)",
  "उप प्रधानाचार्य (Vice Principal)",
  "वरिष्ठ अध्यापक (Senior Teacher)",
  "अध्यापक (Teacher)",
  "सहायक अध्यापक (Assistant Teacher)",
  "शारीरिक शिक्षक (Physical Education Teacher)",
  "संगीत अध्यापक (Music Teacher)",
  "कला अध्यापक (Art Teacher)",
  "पुस्तकालय अध्यक्ष (Librarian)",
  "प्रयोगशाला सहायक (Lab Assistant)"
]

const GENDERS = ["पुरुष (Male)", "महिला (Female)", "अन्य (Other)"]

const CASTE_CATEGORIES = ["अनुसूचित जाति (SC)", "अनुसूचित जनजाति (ST)", "अन्य पिछड़ा वर्ग (OBC)", "सामान्य वर्ग (General)", "आर्थिक रूप से कमजोर वर्ग (EWS)"]

const EDUCATIONAL_QUALIFICATIONS = [
  "8वीं पास",
  "10वीं पास",
  "12वीं पास",
  "स्नातक (Graduate)",
  "स्नातकोत्तर (Post Graduate)",
  "B.Ed",
  "M.Ed",
  "Ph.D",
  "डिप्लोमा (Diploma)"
]

const PROFESSIONAL_QUALIFICATIONS = [
  "B.Ed",
  "M.Ed",
  "D.El.Ed",
  "B.P.Ed",
  "M.P.Ed",
  "NTT",
  "PTT",
  "अन्य (Other)"
]

export default function TeacherPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const res = await getTeachers()
      const teachers = res.data || []
      setData(teachers.map(t => ({
        id: t.id || t._id,
        name: t.name || t.teacher_name || '',
        email: t.email || '',
        phone: t.phone || t.mobile || '',
        subject: t.subject || '',
        classes: t.classes || [],
        qualification: t.qualification || '',
        experience: t.experience || '',
        status: t.status || 'Active',
        joinDate: t.join_date || t.joinDate || new Date().toISOString().split('T')[0],
        avatar: (t.name || t.teacher_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      })))
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const [search, setSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase())
    const matchesSubject = !filterSubject || item.subject === filterSubject
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesSubject && matchesStatus
  })

  const handleAdd = () => {
    navigate('/teachers/add')
  }

  const handleEdit = (item) => {
    // TODO: Navigate to edit page with teacher data
    console.log('Edit teacher:', item)
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('teachers.confirmDelete'))) {
      try {
        await deleteTeacher(id)
        setData(data.filter((item) => item.id !== id))
      } catch (error) {
        console.error('Error deleting teacher:', error)
        alert(t('teachers.failedToDelete'))
      }
    }
  }

  const subjectColors = {
    "Mathematics": "bg-blue-100 text-blue-700",
    "English": "bg-purple-100 text-purple-700",
    "Science": "bg-green-100 text-green-700",
    "Hindi": "bg-orange-100 text-orange-700",
    "Social Studies": "bg-yellow-100 text-yellow-700",
    "Computer Science": "bg-indigo-100 text-indigo-700",
    "Physics": "bg-cyan-100 text-cyan-700",
    "Chemistry": "bg-pink-100 text-pink-700",
    "Biology": "bg-emerald-100 text-emerald-700",
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('teachers.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('teachers.subtitle')}</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
          <Plus className="w-4 h-4" />
          {t('teachers.addTeacher')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              <p className="text-xs text-gray-500">{t('teachers.totalTeachers')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "Active").length}</p>
              <p className="text-xs text-gray-500">{t('teachers.active')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.filter(d => d.status === "On Leave").length}</p>
              <p className="text-xs text-gray-500">{t('teachers.onLeave')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{new Set(data.map(d => d.subject)).size}</p>
              <p className="text-xs text-gray-500">{t('teachers.subjects')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" placeholder={t('teachers.searchTeachers')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="">{t('teachers.allSubjects')}</option>
            {SUBJECTS.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
          </select>
          <select className="border border-gray-200 p-2.5 rounded-lg" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">{t('teachers.allStatus')}</option>
            <option value="Active">{t('teachers.active')}</option>
            <option value="On Leave">{t('teachers.onLeave')}</option>
            <option value="Inactive">{t('common.inactive')}</option>
          </select>
          <button onClick={() => { setSearch(""); setFilterSubject(""); setFilterStatus("") }} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">{t('common.reset')}</button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">{t('teachers.noTeachersFound')}</div>
        ) : (
          filteredData.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">{teacher.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${subjectColors[teacher.subject] || "bg-gray-100 text-gray-700"}`}>{teacher.subject}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(teacher)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(teacher.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" /><span>{teacher.email}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /><span>{teacher.phone}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><GraduationCap className="w-4 h-4" /><span>{teacher.qualification}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Assigned Classes:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.classes.map((cls) => (<span key={cls} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{cls}</span>))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${teacher.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${teacher.status === "Active" ? "bg-green-500" : "bg-orange-500"}`}></span>
                  {teacher.status}
                </span>
                <span className="text-xs text-gray-400">{teacher.experience}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
