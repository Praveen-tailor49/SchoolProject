import { useState } from "react"
import { Plus, Upload } from "lucide-react"

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

    return (
        <div className="p-6 h-screen overflow-y-auto">

            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Student Admission</h1>
                <p className="text-gray-500">Admit new students to the school</p>
            </div>

            {/* Individual Admission Form */}
            <div className="bg-white shadow rounded-lg p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Individual Admission</h2>

                {/* Row 1: Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter student name"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.name}
                            onChange={(e) => setIndividual({ ...individual, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Roll Number</label>
                        <input
                            type="text"
                            placeholder="Auto-generated"
                            className="w-full border p-1 rounded bg-gray-100 text-sm"
                            value={individual.roll}
                            disabled
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Class</label>
                        <input
                            type="text"
                            placeholder="Select class"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.className}
                            onChange={(e) => setIndividual({ ...individual, className: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.dob}
                            onChange={(e) => setIndividual({ ...individual, dob: e.target.value })}
                        />
                    </div>
                </div>

                {/* Row 2: Personal Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.dob}
                            onChange={(e) => setIndividual({ ...individual, dob: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Gender</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.gender}
                            onChange={(e) => setIndividual({ ...individual, gender: e.target.value })}
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Social Category</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.socialCategory}
                            onChange={(e) => setIndividual({ ...individual, socialCategory: e.target.value })}
                        >
                            <option value="">Select social category</option>
                            <option value="General">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                        </select>
                    </div>
                </div>

                {/* Row 3: ID Numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Student NIC ID</label>
                        <input
                            type="text"
                            placeholder="Enter student NIC ID"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.nicId}
                            onChange={(e) => setIndividual({ ...individual, nicId: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Aadhar Number</label>
                        <input
                            type="text"
                            placeholder="Enter Aadhar number"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.aadharNumber}
                            onChange={(e) => setIndividual({ ...individual, aadharNumber: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">SR No.</label>
                        <input
                            type="text"
                            placeholder="Enter SR number"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.srNo}
                            onChange={(e) => setIndividual({ ...individual, srNo: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Study In Class</label>
                        <input
                            type="text"
                            placeholder="Enter class"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.studyInClass}
                            onChange={(e) => setIndividual({ ...individual, studyInClass: e.target.value })}
                        />
                    </div>
                </div>

                {/* Row 4: Family Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Father Name</label>
                        <input
                            type="text"
                            placeholder="Enter father's name"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.fatherName}
                            onChange={(e) => setIndividual({ ...individual, fatherName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Mother Name</label>
                        <input
                            type="text"
                            placeholder="Enter mother's name"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.motherName}
                            onChange={(e) => setIndividual({ ...individual, motherName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Religion</label>
                        <input
                            type="text"
                            placeholder="Enter religion"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.religion}
                            onChange={(e) => setIndividual({ ...individual, religion: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Mother Tongue</label>
                        <input
                            type="text"
                            placeholder="Enter mother tongue"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.motherTongue}
                            onChange={(e) => setIndividual({ ...individual, motherTongue: e.target.value })}
                        />
                    </div>
                </div>

                {/* Row 5: Location & Admission */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Rural/Urban</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.ruralUrban}
                            onChange={(e) => setIndividual({ ...individual, ruralUrban: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Rural">Rural</option>
                            <option value="Urban">Urban</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Habitation Or Locality</label>
                        <input
                            type="text"
                            placeholder="Enter habitation or locality"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.habitationLocality}
                            onChange={(e) => setIndividual({ ...individual, habitationLocality: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Date Of Admission</label>
                        <input
                            type="date"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.dateOfAdmission}
                            onChange={(e) => setIndividual({ ...individual, dateOfAdmission: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Admission Number/SR No</label>
                        <input
                            type="text"
                            placeholder="Enter admission number/SR no"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.admissionNumberSrNo}
                            onChange={(e) => setIndividual({ ...individual, admissionNumberSrNo: e.target.value })}
                        />
                    </div>
                </div>

                {/* Row 7: Social Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Belong To BPL</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.belongToBpl}
                            onChange={(e) => setIndividual({ ...individual, belongToBpl: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Belong To Disadvantaged Group</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.belongToDisadvantagedGroup}
                            onChange={(e) => setIndividual({ ...individual, belongToDisadvantagedGroup: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Getting Free Education</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.gettingFreeEducation}
                            onChange={(e) => setIndividual({ ...individual, gettingFreeEducation: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Not Applicable">Not Applicable</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Studying In Class</label>
                        <input
                            type="text"
                            placeholder="Enter studying class"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.studyingInClass}
                            onChange={(e) => setIndividual({ ...individual, studyingInClass: e.target.value })}
                        />
                    </div>
                </div>

                {/* Row 8: Academic Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Class Studied In Prev. Year</label>
                        <input
                            type="text"
                            placeholder="Enter previous class"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.classStudiedInPrevYear}
                            onChange={(e) => setIndividual({ ...individual, classStudiedInPrevYear: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">If In Class 1, Status Of Previous Year</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.ifInClass1StatusOfPreviousYear}
                            onChange={(e) => setIndividual({ ...individual, ifInClass1StatusOfPreviousYear: e.target.value })}
                        >
                            <option value="">Select status</option>
                            <option value="SAME SCHOOL">Same School</option>
                            <option value="OTHER SCHOOL">Other School</option>
                            <option value="NEW ADMISSION">New Admission</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Days Child Attended School (In The Prev. Year)</label>
                        <input
                            type="number"
                            placeholder="Enter days attended"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.daysChildAttendedSchoolInPrevYear}
                            onChange={(e) => setIndividual({ ...individual, daysChildAttendedSchoolInPrevYear: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Medium Of Instruction</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.mediumOfInstruction}
                            onChange={(e) => setIndividual({ ...individual, mediumOfInstruction: e.target.value })}
                        >
                            <option value="">Select medium</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Regional">Regional</option>
                        </select>
                    </div>
                </div>

                {/* Row 9: Disability & Facilities */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Type Of Disability</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.typeOfDisability}
                            onChange={(e) => setIndividual({ ...individual, typeOfDisability: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Not Applicable">Not Applicable</option>
                            <option value="Visual">Visual</option>
                            <option value="Hearing">Hearing</option>
                            <option value="Speech">Speech</option>
                            <option value="Physical">Physical</option>
                            <option value="Multiple">Multiple</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Facilities Received By CWSN</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.facilitiesReceivedByCWSN}
                            onChange={(e) => setIndividual({ ...individual, facilitiesReceivedByCWSN: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="None">None</option>
                            <option value="Reader">Reader</option>
                            <option value="Writer">Writer</option>
                            <option value="Transport">Transport</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">No. Of Uniform Sets</label>
                        <input
                            type="number"
                            placeholder="Enter number of sets"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.noOfUniformSets}
                            onChange={(e) => setIndividual({ ...individual, noOfUniformSets: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Free Text Books</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.freeTextBooks}
                            onChange={(e) => setIndividual({ ...individual, freeTextBooks: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                {/* Row 11: Transport & Escort */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Free Transport</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.freeTransport}
                            onChange={(e) => setIndividual({ ...individual, freeTransport: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Free Escort</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.freeEscort}
                            onChange={(e) => setIndividual({ ...individual, freeEscort: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">MDM Beneficiary</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.mdmBeneficiary}
                            onChange={(e) => setIndividual({ ...individual, mdmBeneficiary: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                {/* Row 12: Hostel & Training */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Free Hostel Facility</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.freeHostelFacility}
                            onChange={(e) => setIndividual({ ...individual, freeHostelFacility: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Child Attended Special Training</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.childAttendedSpecialTraining}
                            onChange={(e) => setIndividual({ ...individual, childAttendedSpecialTraining: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">In Last Examination Appeared</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.inLastExaminationAppeared}
                            onChange={(e) => setIndividual({ ...individual, inLastExaminationAppeared: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                {/* Row 13: Examination Results */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">In Last Examination Passed</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.inLastExaminationPassed}
                            onChange={(e) => setIndividual({ ...individual, inLastExaminationPassed: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">In Last Examination % Marks</label>
                        <input
                            type="number"
                            placeholder="Enter percentage"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.inLastExaminationMarks}
                            onChange={(e) => setIndividual({ ...individual, inLastExaminationMarks: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Stream (Grades 11 & 12)</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.stream}
                            onChange={(e) => setIndividual({ ...individual, stream: e.target.value })}
                        >
                            <option value="">Select stream</option>
                            <option value="Science">Science</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Arts">Arts</option>
                            <option value="Vocational">Vocational</option>
                        </select>
                    </div>
                </div>

                {/* Row 14: Trade & Health */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Trade/Sector (Grades 9 To 12)</label>
                        <input
                            type="text"
                            placeholder="Enter trade/sector"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.tradeSector}
                            onChange={(e) => setIndividual({ ...individual, tradeSector: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Iron & Folic Acid Tablets</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.ironFolicAcidTablets}
                            onChange={(e) => setIndividual({ ...individual, ironFolicAcidTablets: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Deworming Tablets</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.dewormingTablets}
                            onChange={(e) => setIndividual({ ...individual, dewormingTablets: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                {/* Row 15: Vitamin & Contact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Vitamin-A Supplement</label>
                        <select
                            className="w-full border p-1 rounded text-sm"
                            value={individual.vitaminASupplement}
                            onChange={(e) => setIndividual({ ...individual, vitaminASupplement: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="Enter mobile number"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.mobileNumber}
                            onChange={(e) => setIndividual({ ...individual, mobileNumber: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            className="w-full border p-1 rounded text-sm"
                            value={individual.emailAddress}
                            onChange={(e) => setIndividual({ ...individual, emailAddress: e.target.value })}
                        />
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" />
                    Add Student
                </button>
            </div>

            {/* Bulk Admission Section */}
            <div className="bg-white shadow rounded-lg p-6 space-y-4 mt-6">
                <h2 className="text-lg font-semibold mb-4">Bulk Admission</h2>
                <p className="text-sm text-gray-500">Upload a CSV or Excel file with multiple student records</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs font-medium">Drag and drop your file here</p>
                    <p className="text-xs text-gray-500">or click to browse</p>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition">
                    <Upload className="w-4 h-4" />
                    Choose File
                </button>
            </div>
        </div>
    )
}
