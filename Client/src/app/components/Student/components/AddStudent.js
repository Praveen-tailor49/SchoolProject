import { useState } from "react"
import {User, GraduationCap, MapPin, Heart, BookOpen, Bus, Home, Award, Phone, Mail, ChevronDown, ChevronUp, Check, AlertCircle, Save, X } from "lucide-react"

export default function AddStudentPage() {
    const [individual, setIndividual] = useState({
        name: "",
        roll: "",
        className: "",
        dob: "",
        nicId: "",
        srNo: "",
        aadharNumber: "",
        fatherName: "",
        motherName: "",
        gender: "",
        socialCategory: "",
        religion: "",
        motherTongue: "",
        ruralUrban: "",
        habitationLocality: "",
        dateOfAdmission: "",
        admissionNumberSrNo: "",
        belongToBpl: "",
        belongToDisadvantagedGroup: "",
        gettingFreeEducation: "",
        studyInClass: "",
        studyingInClass: "",
        classStudiedInPrevYear: "",
        ifInClass1StatusOfPreviousYear: "",
        daysChildAttendedSchoolInPrevYear: "",
        mediumOfInstruction: "",
        typeOfDisability: "",
        facilitiesReceivedByCWSN: "",
        noOfUniformSets: "",
        freeTextBooks: "",
        freeTransport: "",
        freeEscort: "",
        mdmBeneficiary: "",
        freeHostelFacility: "",
        childAttendedSpecialTraining: "",
        inLastExaminationAppeared: "",
        inLastExaminationPassed: "",
        inLastExaminationMarks: "",
        stream: "",
        tradeSector: "",
        ironFolicAcidTablets: "",
        dewormingTablets: "",
        vitaminASupplement: "",
        mobileNumber: "",
        emailAddress: "",
    })

    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        personal: true,
        academic: false,
        facilities: false,
        health: false,
        contact: false
    })

    const [errors, setErrors] = useState({})
    const [progress, setProgress] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const calculateProgress = () => {
        const filledFields = Object.values(individual).filter(value => value !== "").length
        const totalFields = Object.keys(individual).length
        return Math.round((filledFields / totalFields) * 100)
    }

    const validateField = (name, value) => {
        let error = ""
        
        switch(name) {
            case 'name':
                if (!value.trim()) error = "Name is required"
                else if (value.trim().length < 3) error = "Name must be at least 3 characters"
                break
            case 'mobileNumber':
                if (value && !/^[6-9]\d{9}$/.test(value)) error = "Invalid mobile number"
                break
            case 'emailAddress':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address"
                break
            case 'aadharNumber':
                if (value && !/^\d{12}$/.test(value)) error = "Aadhar must be 12 digits"
                break
        }
        
        setErrors(prev => ({ ...prev, [name]: error }))
        return !error
    }

    const handleInputChange = (name, value) => {
        setIndividual(prev => ({ ...prev, [name]: value }))
        validateField(name, value)
        setProgress(calculateProgress())
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Validate all required fields
        const requiredFields = ['name', 'className', 'dob', 'gender']
        let hasErrors = false
        
        requiredFields.forEach(field => {
            if (!individual[field]) {
                setErrors(prev => ({ ...prev, [field]: 'This field is required' }))
                hasErrors = true
            }
        })
        
        if (!hasErrors) {
            // Submit logic here
            console.log('Submitting student data:', individual)
            setTimeout(() => {
                setIsSubmitting(false)
                alert('Student added successfully!')
            }, 2000)
        } else {
            setIsSubmitting(false)
        }
    }

    const renderSectionHeader = (title, icon, sectionKey, isRequired = false) => (
        <div 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => toggleSection(sectionKey)}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        {title}
                        {isRequired && <span className="text-red-500 text-sm">*</span>}
                    </h3>
                    <p className="text-xs text-gray-600">
                        {sectionKey === 'basic' && 'Essential student information'}
                        {sectionKey === 'personal' && 'Personal and demographic details'}
                        {sectionKey === 'academic' && 'Educational background and performance'}
                        {sectionKey === 'facilities' && 'School facilities and benefits'}
                        {sectionKey === 'health' && 'Health and medical information'}
                        {sectionKey === 'contact' && 'Contact and communication details'}
                    </p>
                </div>
            </div>
            {expandedSections[sectionKey] ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </div>
    )

    const renderFormField = (label, name, type = "text", placeholder, options = null, required = false) => (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="text-red-500">*</span>}
                {errors[name] && <AlertCircle className="w-4 h-4 text-red-500" />}
            </label>
            
            {options ? (
                <select
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                    value={individual[name]}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                >
                    <option value="">{placeholder}</option>
                    {options.map(option => (
                        <option key={option.value || option} value={option.value || option}>
                            {option.label || option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                    value={individual[name]}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                />
            )}
            
            {errors[name] && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[name]}
                </p>
            )}
        </div>
    )

    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Student Admission
                            </h1>
                            <p className="text-gray-600 mt-1">Complete student registration with comprehensive information</p>
                        </div>
                        
                        {/* Progress Indicator */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Profile Completion</p>
                                <p className="text-2xl font-bold text-blue-600">{progress}%</p>
                            </div>
                            <div className="w-32 h-32 relative">
                                <svg className="transform -rotate-90 w-32 h-32">
                                    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                                    <circle 
                                        cx="64" cy="64" r="56" 
                                        stroke="#3b82f6" 
                                        strokeWidth="12" 
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {progress === 100 ? <Check className="w-8 h-8 text-green-500" /> : <User className="w-8 h-8 text-blue-500" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Basic Information Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {renderSectionHeader("Basic Information", <User className="w-5 h-5 text-blue-600" />, "basic", true)}
                        
                        {expandedSections.basic && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Full Name", "name", "text", "Enter student's full name", null, true)}
                                    {renderFormField("Roll Number", "roll", "text", "Auto-generated", null, false)}
                                    {renderFormField("Class", "className", "text", "Enter class", null, true)}
                                    {renderFormField("Date of Birth", "dob", "date", "Select date of birth", null, true)}
                                    {renderFormField("Gender", "gender", "select", "Select gender", [
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                        { value: "Other", label: "Other" }
                                    ], true)}
                                    {renderFormField("Social Category", "socialCategory", "select", "Select category", [
                                        { value: "General", label: "General" },
                                        { value: "OBC", label: "OBC" },
                                        { value: "SC", label: "SC" },
                                        { value: "ST", label: "ST" },
                                        { value: "EWS", label: "EWS" }
                                    ])}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Personal Details Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {renderSectionHeader("Personal Details", <Heart className="w-5 h-5 text-pink-600" />, "personal")}
                        
                        {expandedSections.personal && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Father's Name", "fatherName", "text", "Enter father's name")}
                                    {renderFormField("Mother's Name", "motherName", "text", "Enter mother's name")}
                                    {renderFormField("Religion", "religion", "text", "Enter religion")}
                                    {renderFormField("Mother Tongue", "motherTongue", "text", "Enter mother tongue")}
                                    {renderFormField("Rural/Urban", "ruralUrban", "select", "Select location type", [
                                        { value: "Rural", label: "Rural" },
                                        { value: "Urban", label: "Urban" }
                                    ])}
                                    {renderFormField("Habitation/Locality", "habitationLocality", "text", "Enter habitation or locality")}
                                </div>
                                
                                {/* ID Numbers */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Identification Documents
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {renderFormField("Student NIC ID", "nicId", "text", "Enter student NIC ID")}
                                        {renderFormField("Aadhar Number", "aadharNumber", "text", "Enter 12-digit Aadhar number")}
                                        {renderFormField("SR Number", "srNo", "text", "Enter SR number")}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Academic Information Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {renderSectionHeader("Academic Information", <GraduationCap className="w-5 h-5 text-green-600" />, "academic")}
                        
                        {expandedSections.academic && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Date of Admission", "dateOfAdmission", "date", "Select admission date")}
                                    {renderFormField("Admission Number", "admissionNumberSrNo", "text", "Enter admission number")}
                                    {renderFormField("Study In Class", "studyInClass", "text", "Enter current studying class")}
                                    {renderFormField("Studying In Class", "studyingInClass", "text", "Enter studying class")}
                                    {renderFormField("Previous Class", "classStudiedInPrevYear", "text", "Enter previous class")}
                                    {renderFormField("Days Attended (Prev Year)", "daysChildAttendedSchoolInPrevYear", "number", "Enter days attended")}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Medium of Instruction", "mediumOfInstruction", "select", "Select medium", [
                                        { value: "English", label: "English" },
                                        { value: "Hindi", label: "Hindi" },
                                        { value: "Regional", label: "Regional" }
                                    ])}
                                    {renderFormField("Stream (11-12)", "stream", "select", "Select stream", [
                                        { value: "Science", label: "Science" },
                                        { value: "Commerce", label: "Commerce" },
                                        { value: "Arts", label: "Arts" },
                                        { value: "Vocational", label: "Vocational" }
                                    ])}
                                    {renderFormField("Trade/Sector", "tradeSector", "text", "Enter trade/sector")}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Facilities & Benefits Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {renderSectionHeader("Facilities & Benefits", <BookOpen className="w-5 h-5 text-purple-600" />, "facilities")}
                        
                        {expandedSections.facilities && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Belong to BPL", "belongToBpl", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                    {renderFormField("Disadvantaged Group", "belongToDisadvantagedGroup", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                    {renderFormField("Free Education", "gettingFreeEducation", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" },
                                        { value: "Not Applicable", label: "Not Applicable" }
                                    ])}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Free Text Books", "freeTextBooks", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                    {renderFormField("Free Transport", "freeTransport", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                    {renderFormField("Free Hostel", "freeHostelFacility", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Health Information Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {renderSectionHeader("Health Information", <Heart className="w-5 h-5 text-red-600" />, "health")}
                        
                        {expandedSections.health && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Type of Disability", "typeOfDisability", "select", "Select type", [
                                        { value: "Not Applicable", label: "Not Applicable" },
                                        { value: "Visual", label: "Visual" },
                                        { value: "Hearing", label: "Hearing" },
                                        { value: "Speech", label: "Speech" },
                                        { value: "Physical", label: "Physical" },
                                        { value: "Multiple", label: "Multiple" }
                                    ])}
                                    {renderFormField("Iron Folic Acid Tablets", "ironFolicAcidTablets", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                    {renderFormField("Deworming Tablets", "dewormingTablets", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                    {renderFormField("Vitamin-A Supplement", "vitaminASupplement", "select", "Select option", [
                                        { value: "Yes", label: "Yes" },
                                        { value: "No", label: "No" }
                                    ])}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {renderSectionHeader("Contact Information", <Phone className="w-5 h-5 text-indigo-600" />, "contact")}
                        
                        {expandedSections.contact && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {renderFormField("Mobile Number", "mobileNumber", "tel", "Enter 10-digit mobile number")}
                                    {renderFormField("Email Address", "emailAddress", "email", "Enter email address")}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border sticky bottom-0">
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                        <Save className="w-4 h-4" />   
                                    Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
