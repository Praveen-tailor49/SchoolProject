import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, X, Loader2 } from "lucide-react"
import { createTeacher, updateTeacher } from "../../../../services/apiService"
import { useTranslation } from "../../../contexts/LanguageContext"

const SUBJECTS = ["Mathematics", "English", "Science", "Hindi", "Social Studies", "Computer Science", "Physics", "Chemistry", "Biology"]

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

export default function AddTeacherPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ 
    employeeType: "शैक्षिणिक",
    designation: "", 
    aadhaarNumber: "", 
    name: "", 
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    casteCategory: "",
    educationalQualification: "",
    professionalQualification: "",
    appointmentDate: "",
    mobileNumber: "",
    secondaryRollNumber: "",
    secondaryYear: "",
    currentSubject: "",
    ctetQualified: ""
  })

  const handleSave = async () => {
    if (!formData.name || !formData.designation || !formData.mobileNumber) {
      alert(t('teachers.fillRequiredFields'))
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        employee_type: formData.employeeType,
        designation: formData.designation,
        aadhaar_number: formData.aadhaarNumber,
        teacher_name: formData.name,
        father_name: formData.fatherName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        caste_category: formData.casteCategory,
        educational_qualification: formData.educationalQualification,
        professional_qualification: formData.professionalQualification,
        appointment_date: formData.appointmentDate,
        mobile_number: formData.mobileNumber,
        secondary_roll_number: formData.secondaryRollNumber,
        secondary_year: formData.secondaryYear,
        current_subject: formData.currentSubject,
        ctet_qualified: formData.ctetQualified
      }
      
      await createTeacher(payload)
      navigate('/teachers')
    } catch (error) {
      console.error('Error saving teacher:', error)
      alert(t('teachers.failedToSave'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/teachers')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('teachers.addNewTeacher')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('teachers.fillTeacherDetails')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/teachers')}
            className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            {t('common.cancel')}
          </button>
          <button 
            disabled={saving}
            onClick={handleSave}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('teachers.saveTeacher')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Employee Type Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">कर्मचारी का प्रकार (Employee Type)</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="employeeType"
                  value="शैक्षिणिक"
                  checked={formData.employeeType === "शैक्षिणिक"}
                  onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm">शैक्षिणिक (Educational)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="employeeType"
                  value="गैर शैक्षिणिक"
                  checked={formData.employeeType === "गैर शैक्षिणिक"}
                  onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm">गैर शैक्षिणिक (Non-educational)</span>
              </label>
            </div>
          </div>

          {/* Current Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">कर्मचारी का वर्तमान पदनाम (Current Designation) *</label>
            <select 
              className="w-full border border-gray-200 p-2.5 rounded-lg" 
              value={formData.designation} 
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            >
              <option value="">--Select--</option>
              {DESIGNATIONS.map((designation) => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">कर्मचारी का आधार नम्बर (Aadhaar Number)</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 p-2.5 rounded-lg" 
              value={formData.aadhaarNumber} 
              onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })} 
              placeholder="Enter 12-digit Aadhaar number"
              maxLength={12}
            />
          </div>

          {/* Name and Father's Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">कर्मचारी का नाम (Name) *</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Enter full name" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">कर्मचारी के पिता नाम (Father's Name)</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.fatherName} 
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} 
                placeholder="Enter father's name" 
              />
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">जन्म तिथि (Date of Birth)</label>
              <input 
                type="date" 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.dateOfBirth} 
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">लिंग (Gender)</label>
              <select 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.gender} 
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">--Select--</option>
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Caste Category and Educational Qualification */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">जाति-संवर्ग (Caste Category)</label>
              <select 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.casteCategory} 
                onChange={(e) => setFormData({ ...formData, casteCategory: e.target.value })}
              >
                <option value="">--Select--</option>
                {CASTE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">शैक्षणिक योग्यता (Educational Qualification)</label>
              <select 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.educationalQualification} 
                onChange={(e) => setFormData({ ...formData, educationalQualification: e.target.value })}
              >
                <option value="">--Select--</option>
                {EDUCATIONAL_QUALIFICATIONS.map((qualification) => (
                  <option key={qualification} value={qualification}>{qualification}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Professional Qualification and Appointment Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">प्रशैक्षणिक योग्यता (Professional Qualification)</label>
              <select 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.professionalQualification} 
                onChange={(e) => setFormData({ ...formData, professionalQualification: e.target.value })}
              >
                <option value="">--Select--</option>
                {PROFESSIONAL_QUALIFICATIONS.map((qualification) => (
                  <option key={qualification} value={qualification}>{qualification}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">विद्यालय में नियुक्ति तिथि (Appointment Date)</label>
              <input 
                type="date" 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.appointmentDate} 
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              />
            </div>
          </div>

          {/* Mobile Number and Secondary Roll Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">मोबाइल नंबर (Mobile Number) *</label>
              <input 
                type="tel" 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.mobileNumber} 
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
                placeholder="Enter Mobile No."
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">सेकेंडरी का रोल नंबर (Secondary Roll Number)</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.secondaryRollNumber} 
                onChange={(e) => setFormData({ ...formData, secondaryRollNumber: e.target.value })} 
                placeholder="Enter roll number"
              />
            </div>
          </div>

          {/* Secondary Year and Current Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">सेकेंडरी का वर्ष (Secondary Year)</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.secondaryYear} 
                onChange={(e) => setFormData({ ...formData, secondaryYear: e.target.value })} 
                placeholder="Enter year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">कर्मचारी का वर्तमान विषय (Current Subject)</label>
              <select 
                className="w-full border border-gray-200 p-2.5 rounded-lg" 
                value={formData.currentSubject} 
                onChange={(e) => setFormData({ ...formData, currentSubject: e.target.value })}
              >
                <option value="">--Select--</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTET Qualified */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">क्या शिक्षक RTET/REET/CTET योग्यता प्राप्त है (Is teacher RTET/REET/CTET qualified?)</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ctetQualified"
                  value="हाँ"
                  checked={formData.ctetQualified === "हाँ"}
                  onChange={(e) => setFormData({ ...formData, ctetQualified: e.target.value })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm">हाँ (Yes)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ctetQualified"
                  value="ना"
                  checked={formData.ctetQualified === "ना"}
                  onChange={(e) => setFormData({ ...formData, ctetQualified: e.target.value })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm">ना (No)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
