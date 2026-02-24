// Test script for Student API
// Run this with: node test/student_api_test.js

import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:9000/api/students';

// Test data for creating a student
const testStudent = {
  name: "Test Student",
  roll: "STU001",
  className: "Class 10-A",
  dob: "2008-05-15",
  nicId: "NIC123456789",
  srNo: "SR001",
  aadharNumber: "123456789012",
  fatherName: "Father Name",
  motherName: "Mother Name",
  gender: "Male",
  socialCategory: "General",
  religion: "Hindu",
  motherTongue: "Hindi",
  ruralUrban: "Urban",
  habitationLocality: "City Area",
  dateOfAdmission: "2020-06-01",
  admissionNumberSrNo: "ADM2020001",
  belongToBpl: false,
  belongToDisadvantagedGroup: false,
  gettingFreeEducation: false,
  studyInClass: "Class 10",
  studyingInClass: "Class 10-A",
  classStudiedInPrevYear: "Class 9",
  ifInClass1StatusOfPreviousYear: "Not Applicable",
  daysChildAttendedSchoolInPrevYear: 220,
  mediumOfInstruction: "English",
  typeOfDisability: "None",
  facilitiesReceivedByCWSN: "None",
  noOfUniformSets: 2,
  freeTextBooks: true,
  freeTransport: false,
  freeEscort: false,
  mdmBeneficiary: true,
  freeHostelFacility: false,
  childAttendedSpecialTraining: false,
  inLastExaminationAppeared: "Class 9 Final",
  inLastExaminationPassed: "Class 9 Final",
  inLastExaminationMarks: "85%",
  stream: "Science",
  tradeSector: "Not Applicable",
  ironFolicAcidTablets: true,
  dewormingTablets: true,
  vitaminASupplement: true,
  mobileNumber: "9876543210",
  emailAddress: "teststudent@example.com",
  totalFees: 25000.00,
  paidFees: 15000.00,
  pendingFees: 10000.00,
  lastFeePaymentDate: "2024-01-15",
  nextFeeDueDate: "2024-04-15"
};

// Test functions
async function testCreateStudent() {
  try {
    console.log('Testing Create Student API...');
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      },
      body: JSON.stringify(testStudent)
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.status === 201) {
      console.log('✅ Student created successfully!');
      return data.id; // Return student ID for further tests
    } else {
      console.log('❌ Failed to create student');
      return null;
    }
  } catch (error) {
    console.error('Error creating student:', error);
    return null;
  }
}

async function testGetAllStudents() {
  try {
    console.log('\nTesting Get All Students API...');
    
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      }
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Number of students:', data.length);
    console.log('Sample student:', JSON.stringify(data[0] || {}, null, 2));
    
    if (response.status === 200) {
      console.log('✅ Students retrieved successfully!');
    } else {
      console.log('❌ Failed to retrieve students');
    }
  } catch (error) {
    console.error('Error retrieving students:', error);
  }
}

async function testGetStudentById(studentId) {
  if (!studentId) {
    console.log('\n⚠️ Skipping Get Student by ID test - no student ID available');
    return;
  }

  try {
    console.log(`\nTesting Get Student by ID (${studentId}) API...`);
    
    const response = await fetch(`${API_BASE_URL}/${studentId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      }
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Student Data:', JSON.stringify(data, null, 2));
    
    if (response.status === 200) {
      console.log('✅ Student retrieved successfully!');
    } else {
      console.log('❌ Failed to retrieve student');
    }
  } catch (error) {
    console.error('Error retrieving student:', error);
  }
}

async function testUpdateStudent(studentId) {
  if (!studentId) {
    console.log('\n⚠️ Skipping Update Student test - no student ID available');
    return;
  }

  try {
    console.log(`\nTesting Update Student (${studentId}) API...`);
    
    const updatedData = {
      ...testStudent,
      name: "Updated Test Student",
      mobileNumber: "9999999999"
    };
    
    const response = await fetch(`${API_BASE_URL}/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      },
      body: JSON.stringify(updatedData)
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.status === 200) {
      console.log('✅ Student updated successfully!');
    } else {
      console.log('❌ Failed to update student');
    }
  } catch (error) {
    console.error('Error updating student:', error);
  }
}

async function testDeleteStudent(studentId) {
  if (!studentId) {
    console.log('\n⚠️ Skipping Delete Student test - no student ID available');
    return;
  }

  try {
    console.log(`\nTesting Delete Student (${studentId}) API...`);
    
    const response = await fetch(`${API_BASE_URL}/${studentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' // Replace with actual token
      }
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.status === 200) {
      console.log('✅ Student deleted successfully!');
    } else {
      console.log('❌ Failed to delete student');
    }
  } catch (error) {
    console.error('Error deleting student:', error);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Student API Tests...\n');
  
  // Note: Replace 'YOUR_JWT_TOKEN_HERE' with an actual JWT token
  console.log('⚠️ Make sure to replace YOUR_JWT_TOKEN_HERE with a valid JWT token');
  console.log('⚠️ Make sure the API server is running on http://localhost:9000');
  console.log('⚠️ Make sure the database is updated with the new student table schema\n');
  
  const studentId = await testCreateStudent();
  await testGetAllStudents();
  await testGetStudentById(studentId);
  await testUpdateStudent(studentId);
  await testDeleteStudent(studentId);
  
  console.log('\n🏁 Student API Tests Completed!');
}

// Run the tests
runTests().catch(console.error);
