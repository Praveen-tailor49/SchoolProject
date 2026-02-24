# Student API Documentation

## Base URL
```
http://localhost:9000/api/students
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Student (POST /)
Create a new student with comprehensive information.

**Request Body:**
```json
{
  "name": "Student Name",
  "roll": "Roll Number",
  "className": "Class Name",
  "dob": "YYYY-MM-DD",
  "nicId": "NIC ID",
  "srNo": "Serial Number",
  "aadharNumber": "Aadhar Number",
  "fatherName": "Father's Name",
  "motherName": "Mother's Name",
  "gender": "Male|Female|Other",
  "socialCategory": "Social Category",
  "religion": "Religion",
  "motherTongue": "Mother Tongue",
  "ruralUrban": "Rural|Urban",
  "habitationLocality": "Habitation/Locality",
  "dateOfAdmission": "YYYY-MM-DD",
  "admissionNumberSrNo": "Admission Number",
  "belongToBpl": true|false,
  "belongToDisadvantagedGroup": true|false,
  "gettingFreeEducation": true|false,
  "studyInClass": "Study Class",
  "studyingInClass": "Current Studying Class",
  "classStudiedInPrevYear": "Previous Year Class",
  "ifInClass1StatusOfPreviousYear": "Class 1 Status Previous Year",
  "daysChildAttendedSchoolInPrevYear": 200,
  "mediumOfInstruction": "Medium of Instruction",
  "typeOfDisability": "Type of Disability",
  "facilitiesReceivedByCWSN": "CWSN Facilities",
  "noOfUniformSets": 2,
  "freeTextBooks": true|false,
  "freeTransport": true|false,
  "freeEscort": true|false,
  "mdmBeneficiary": true|false,
  "freeHostelFacility": true|false,
  "childAttendedSpecialTraining": true|false,
  "inLastExaminationAppeared": "Exam Appeared",
  "inLastExaminationPassed": "Exam Passed",
  "inLastExaminationMarks": "Marks Obtained",
  "stream": "Stream",
  "tradeSector": "Trade Sector",
  "ironFolicAcidTablets": true|false,
  "dewormingTablets": true|false,
  "vitaminASupplement": true|false,
  "mobileNumber": "Mobile Number",
  "emailAddress": "Email Address",
  "totalFees": 25000.00,
  "paidFees": 15000.00,
  "pendingFees": 10000.00,
  "lastFeePaymentDate": "YYYY-MM-DD",
  "nextFeeDueDate": "YYYY-MM-DD"
}
```

**Response (201 Created):**
```json
{
  "message": "Student added successfully",
  "data": {
    "student_id": 1,
    "name": "Student Name",
    "roll": "Roll Number",
    "className": "Class Name",
    "dob": "YYYY-MM-DD",
    "nicId": "NIC ID",
    "srNo": "Serial Number",
    "aadharNumber": "Aadhar Number",
    "fatherName": "Father's Name",
    "motherName": "Mother's Name",
    "gender": "Male",
    "socialCategory": "Social Category",
    "religion": "Religion",
    "motherTongue": "Mother Tongue",
    "ruralUrban": "Rural",
    "habitationLocality": "Habitation/Locality",
    "dateOfAdmission": "YYYY-MM-DD",
    "admissionNumberSrNo": "Admission Number",
    "belongToBpl": false,
    "belongToDisadvantagedGroup": false,
    "gettingFreeEducation": false,
    "studyInClass": "Study Class",
    "studyingInClass": "Current Studying Class",
    "classStudiedInPrevYear": "Previous Year Class",
    "ifInClass1StatusOfPreviousYear": "Class 1 Status Previous Year",
    "daysChildAttendedSchoolInPrevYear": 200,
    "mediumOfInstruction": "Medium of Instruction",
    "typeOfDisability": "Type of Disability",
    "facilitiesReceivedByCWSN": "CWSN Facilities",
    "noOfUniformSets": 2,
    "freeTextBooks": false,
    "freeTransport": false,
    "freeEscort": false,
    "mdmBeneficiary": false,
    "freeHostelFacility": false,
    "childAttendedSpecialTraining": false,
    "inLastExaminationAppeared": "Exam Appeared",
    "inLastExaminationPassed": "Exam Passed",
    "inLastExaminationMarks": "Marks Obtained",
    "stream": "Stream",
    "tradeSector": "Trade Sector",
    "ironFolicAcidTablets": false,
    "dewormingTablets": false,
    "vitaminASupplement": false,
    "mobileNumber": "Mobile Number",
    "emailAddress": "Email Address",
    "totalFees": 25000.00,
    "paidFees": 15000.00,
    "pendingFees": 10000.00,
    "lastFeePaymentDate": "YYYY-MM-DD",
    "nextFeeDueDate": "YYYY-MM-DD",
    "status": "Active",
    "created_at": "YYYY-MM-DD HH:MM:SS"
  },
  "id": 1
}
```

### 2. Get All Students (GET /)
Retrieve all students with their information.

**Response (200 OK):**
```json
[
  {
    "student_id": 1,
    "name": "Student Name",
    "roll": "Roll Number",
    "className": "Class Name",
    "dob": "YYYY-MM-DD",
    "gender": "Male",
    "mobileNumber": "Mobile Number",
    "emailAddress": "Email Address",
    "status": "Active",
    "created_at": "YYYY-MM-DD HH:MM:SS"
  }
]
```

### 3. Get Student by ID (GET /:id)
Retrieve a specific student by their ID.

**Response (200 OK):**
```json
{
  "data": {
    "student_id": 1,
    "name": "Student Name",
    "roll": "Roll Number",
    "className": "Class Name",
    "dob": "YYYY-MM-DD",
    "gender": "Male",
    "mobileNumber": "Mobile Number",
    "emailAddress": "Email Address",
    "status": "Active",
    "created_at": "YYYY-MM-DD HH:MM:SS"
  },
  "message": "Student fetched successfully"
}
```

### 4. Update Student (PUT /:id)
Update student information.

**Request Body:** Same as Create Student
**Response (200 OK):**
```json
{
  "message": "Student updated successfully"
}
```

### 5. Delete Student (DELETE /:id)
Delete a student record.

**Response (200 OK):**
```json
{
  "message": "Student deleted successfully"
}
```

### 6. Get Students by Class (GET /class/:classId)
Retrieve all students belonging to a specific class.

**Response (200 OK):**
```json
{
  "data": [
    {
      "student_id": 1,
      "name": "Student Name",
      "class_id": 1,
      "status": "Active"
    }
  ],
  "message": "Students fetched successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Student not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

## Database Setup

Before using the API, run the SQL script to update the students table:
```sql
-- Run this script to add all required fields to the students table
source database/update_student_table.sql;
```

## Field Descriptions

### Personal Information
- `name`: Student's full name
- `roll`: Roll number
- `className`: Class name
- `dob`: Date of birth (YYYY-MM-DD)
- `nicId`: National ID card number
- `srNo`: Serial number
- `aadharNumber`: Aadhar card number
- `fatherName`: Father's name
- `motherName`: Mother's name
- `gender`: Gender (Male/Female/Other)

### Demographic Information
- `socialCategory`: Social category
- `religion`: Religion
- `motherTongue`: Mother tongue
- `ruralUrban`: Rural or Urban
- `habitationLocality`: Habitation/Locality

### Academic Information
- `dateOfAdmission`: Date of admission
- `admissionNumberSrNo`: Admission number
- `studyInClass`: Class studying in
- `studyingInClass`: Current studying class
- `classStudiedInPrevYear`: Previous year class
- `ifInClass1StatusOfPreviousYear`: Class 1 status in previous year
- `daysChildAttendedSchoolInPrevYear`: Days attended in previous year
- `mediumOfInstruction`: Medium of instruction
- `stream`: Academic stream
- `tradeSector`: Trade sector

### Examination Information
- `inLastExaminationAppeared`: Last examination appeared
- `inLastExaminationPassed`: Last examination passed
- `inLastExaminationMarks`: Marks obtained

### Special Facilities
- `typeOfDisability`: Type of disability
- `facilitiesReceivedByCWSN`: Facilities for Children With Special Needs
- `childAttendedSpecialTraining`: Attended special training

### Benefits and Facilities
- `belongToBpl`: Belongs to BPL (Below Poverty Line)
- `belongToDisadvantagedGroup`: Belongs to disadvantaged group
- `gettingFreeEducation`: Getting free education
- `noOfUniformSets`: Number of uniform sets
- `freeTextBooks`: Free textbooks provided
- `freeTransport`: Free transport provided
- `freeEscort`: Free escort provided
- `mdmBeneficiary`: Mid-day meal beneficiary
- `freeHostelFacility`: Free hostel facility

### Health Benefits
- `ironFolicAcidTablets`: Iron folic acid tablets provided
- `dewormingTablets`: Deworming tablets provided
- `vitaminASupplement`: Vitamin A supplement provided

### Contact Information
- `mobileNumber`: Mobile number
- `emailAddress`: Email address

### Fee Information
- `totalFees`: Total fees amount (decimal, 10,2)
- `paidFees`: Paid fees amount (decimal, 10,2)
- `pendingFees`: Pending fees amount (decimal, 10,2)
- `lastFeePaymentDate`: Last fee payment date (YYYY-MM-DD)
- `nextFeeDueDate`: Next fee due date (YYYY-MM-DD)
