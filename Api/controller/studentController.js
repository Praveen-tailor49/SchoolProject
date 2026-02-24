import db from '../db.js';

export const getAllStudents = async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT s.*, c.class_name, c.section as class_section 
      FROM students s 
      LEFT JOIN classes c ON s.class_id = c.class_id 
      ORDER BY s.created_at DESC
    `);
    res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [student] = await db.query("SELECT * FROM students WHERE student_id = ?", [id]);
    if (student.length === 0) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ data: student[0], message: "Student fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const {
      name, roll, className, dob, nicId, srNo, aadharNumber, fatherName, motherName,
      gender, socialCategory, religion, motherTongue, ruralUrban, habitationLocality,
      dateOfAdmission, admissionNumberSrNo, belongToBpl, belongToDisadvantagedGroup,
      gettingFreeEducation, studyInClass, studyingInClass, classStudiedInPrevYear,
      ifInClass1StatusOfPreviousYear, daysChildAttendedSchoolInPrevYear,
      mediumOfInstruction, typeOfDisability, facilitiesReceivedByCWSN,
      noOfUniformSets, freeTextBooks, freeTransport, freeEscort, mdmBeneficiary,
      freeHostelFacility, childAttendedSpecialTraining, inLastExaminationAppeared,
      inLastExaminationPassed, inLastExaminationMarks, stream, tradeSector,
      ironFolicAcidTablets, dewormingTablets, vitaminASupplement, mobileNumber,
      emailAddress, totalFees, paidFees, pendingFees, lastFeePaymentDate, nextFeeDueDate,
      roll_no, class_id, section, phone, email, address, parent_name, parent_phone, status
    } = req.body;
    
    const studentData = {
      name: name || null,
      roll: roll || null,
      className: className || null,
      dob: dob || null,
      nicId: nicId || null,
      srNo: srNo || null,
      aadharNumber: aadharNumber || null,
      fatherName: fatherName || parent_name || null,
      motherName: motherName || null,
      gender: gender || null,
      socialCategory: socialCategory || null,
      religion: religion || null,
      motherTongue: motherTongue || null,
      ruralUrban: ruralUrban || null,
      habitationLocality: habitationLocality || null,
      dateOfAdmission: dateOfAdmission || null,
      admissionNumberSrNo: admissionNumberSrNo || null,
      belongToBpl: belongToBpl || false,
      belongToDisadvantagedGroup: belongToDisadvantagedGroup || false,
      gettingFreeEducation: gettingFreeEducation || false,
      studyInClass: studyInClass || null,
      studyingInClass: studyingInClass || null,
      classStudiedInPrevYear: classStudiedInPrevYear || null,
      ifInClass1StatusOfPreviousYear: ifInClass1StatusOfPreviousYear || null,
      daysChildAttendedSchoolInPrevYear: daysChildAttendedSchoolInPrevYear || null,
      mediumOfInstruction: mediumOfInstruction || null,
      typeOfDisability: typeOfDisability || null,
      facilitiesReceivedByCWSN: facilitiesReceivedByCWSN || null,
      noOfUniformSets: noOfUniformSets || 0,
      freeTextBooks: freeTextBooks || false,
      freeTransport: freeTransport || false,
      freeEscort: freeEscort || false,
      mdmBeneficiary: mdmBeneficiary || false,
      freeHostelFacility: freeHostelFacility || false,
      childAttendedSpecialTraining: childAttendedSpecialTraining || false,
      inLastExaminationAppeared: inLastExaminationAppeared || null,
      inLastExaminationPassed: inLastExaminationPassed || null,
      inLastExaminationMarks: inLastExaminationMarks || null,
      stream: stream || null,
      tradeSector: tradeSector || null,
      ironFolicAcidTablets: ironFolicAcidTablets || false,
      dewormingTablets: dewormingTablets || false,
      vitaminASupplement: vitaminASupplement || false,
      mobileNumber: mobileNumber || phone || null,
      emailAddress: emailAddress || email || null,
      totalFees: totalFees || 0.00,
      paidFees: paidFees || 0.00,
      pendingFees: pendingFees || 0.00,
      lastFeePaymentDate: lastFeePaymentDate || null,
      nextFeeDueDate: nextFeeDueDate || null,
      // Legacy fields for backward compatibility
      roll_no: roll_no || roll || null,
      class_id: class_id || null,
      section: section || null,
      phone: phone || mobileNumber || null,
      email: email || emailAddress || null,
      address: address || null,
      parent_name: parent_name || fatherName || null,
      parent_phone: parent_phone || null,
      status: status || 'Active',
      created_at: new Date()
    };
    
    const [result] = await db.query("INSERT INTO students SET ?", studentData);
    const [newStudent] = await db.query("SELECT * FROM students WHERE student_id = ?", [result.insertId]);
    
    res.status(201).json({ 
      message: "Student added successfully", 
      data: newStudent[0],
      id: result.insertId 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, roll, className, dob, nicId, srNo, aadharNumber, fatherName, motherName,
      gender, socialCategory, religion, motherTongue, ruralUrban, habitationLocality,
      dateOfAdmission, admissionNumberSrNo, belongToBpl, belongToDisadvantagedGroup,
      gettingFreeEducation, studyInClass, studyingInClass, classStudiedInPrevYear,
      ifInClass1StatusOfPreviousYear, daysChildAttendedSchoolInPrevYear,
      mediumOfInstruction, typeOfDisability, facilitiesReceivedByCWSN,
      noOfUniformSets, freeTextBooks, freeTransport, freeEscort, mdmBeneficiary,
      freeHostelFacility, childAttendedSpecialTraining, inLastExaminationAppeared,
      inLastExaminationPassed, inLastExaminationMarks, stream, tradeSector,
      ironFolicAcidTablets, dewormingTablets, vitaminASupplement, mobileNumber,
      emailAddress, totalFees, paidFees, pendingFees, lastFeePaymentDate, nextFeeDueDate,
      roll_no, class_id, section, phone, email, address, parent_name, parent_phone, status
    } = req.body;
    
    const studentData = {
      name: name || null,
      roll: roll || null,
      className: className || null,
      dob: dob || null,
      nicId: nicId || null,
      srNo: srNo || null,
      aadharNumber: aadharNumber || null,
      fatherName: fatherName || parent_name || null,
      motherName: motherName || null,
      gender: gender || null,
      socialCategory: socialCategory || null,
      religion: religion || null,
      motherTongue: motherTongue || null,
      ruralUrban: ruralUrban || null,
      habitationLocality: habitationLocality || null,
      dateOfAdmission: dateOfAdmission || null,
      admissionNumberSrNo: admissionNumberSrNo || null,
      belongToBpl: belongToBpl || false,
      belongToDisadvantagedGroup: belongToDisadvantagedGroup || false,
      gettingFreeEducation: gettingFreeEducation || false,
      studyInClass: studyInClass || null,
      studyingInClass: studyingInClass || null,
      classStudiedInPrevYear: classStudiedInPrevYear || null,
      ifInClass1StatusOfPreviousYear: ifInClass1StatusOfPreviousYear || null,
      daysChildAttendedSchoolInPrevYear: daysChildAttendedSchoolInPrevYear || null,
      mediumOfInstruction: mediumOfInstruction || null,
      typeOfDisability: typeOfDisability || null,
      facilitiesReceivedByCWSN: facilitiesReceivedByCWSN || null,
      noOfUniformSets: noOfUniformSets || 0,
      freeTextBooks: freeTextBooks || false,
      freeTransport: freeTransport || false,
      freeEscort: freeEscort || false,
      mdmBeneficiary: mdmBeneficiary || false,
      freeHostelFacility: freeHostelFacility || false,
      childAttendedSpecialTraining: childAttendedSpecialTraining || false,
      inLastExaminationAppeared: inLastExaminationAppeared || null,
      inLastExaminationPassed: inLastExaminationPassed || null,
      inLastExaminationMarks: inLastExaminationMarks || null,
      stream: stream || null,
      tradeSector: tradeSector || null,
      ironFolicAcidTablets: ironFolicAcidTablets || false,
      dewormingTablets: dewormingTablets || false,
      vitaminASupplement: vitaminASupplement || false,
      mobileNumber: mobileNumber || phone || null,
      emailAddress: emailAddress || email || null,
      totalFees: totalFees || 0.00,
      paidFees: paidFees || 0.00,
      pendingFees: pendingFees || 0.00,
      lastFeePaymentDate: lastFeePaymentDate || null,
      nextFeeDueDate: nextFeeDueDate || null,
      // Legacy fields for backward compatibility
      roll_no: roll_no || roll || null,
      class_id: class_id || null,
      section: section || null,
      phone: phone || mobileNumber || null,
      email: email || emailAddress || null,
      address: address || null,
      parent_name: parent_name || fatherName || null,
      parent_phone: parent_phone || null,
      status: status || 'Active'
    };
    
    await db.query("UPDATE students SET ? WHERE student_id = ?", [studentData, id]);
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM students WHERE student_id = ?", [id]);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const [students] = await db.query("SELECT * FROM students WHERE class_id = ?", [classId]);
    res.status(200).json({ data: students, message: "Students fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
