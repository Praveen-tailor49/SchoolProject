import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '../components/Common/DashboardLayout'
import RoleBaseRoute from './RoleBaseRoute'
import PageNotFound from '../components/Common/PageNotFound'
import DashboardPage from '../components/Dashboard'
import ClassPage from '../components/academic/Class'
import SubjectsPage from '../components/academic/Subject'
import AttendancePage from '../components/academic/Attentance'
import StudyMaterialPage from '../components/academic/StudyMaterial'
import HomeworkPage from '../components/academic/Homework'
import NoticeboardPage from '../components/academic/Noticeboard'
import EventsPage from '../components/academic/Events'
import AddStudentPage from '../components/Student/components/AddStudent'
import StudentList from '../components/Student/index'
import IdCardsPage from '../components/Student/components/IdCard'
import PromotionPage from '../components/Student/components/Promotion'
import TransferPage from '../components/Student/components/Transfer'
import CertificatesPage from '../components/Student/components/Certificates'
import TeacherPage from '../components/Teacher'
import AddTeacherPage from '../components/Teacher/components/AddTeacher'
import AdminsPage from '../components/Administrator/Admins'
import StaffPage from '../components/Administrator/Staff'
import InvoicesPage from '../components/Accounting/Invoices'
import PaymentsPage from '../components/Accounting/Payments'
import ExpensePage from '../components/Accounting/Expense'
import IncomePage from '../components/Accounting/Income'
import FeeTypesPage from '../components/Accounting/FeeTypes'
import ExamsPage from '../components/Examination/Exams'
import ResultsPage from '../components/Examination/Results'
import BooksPage from '../components/Library/Books'
import IssueReturnPage from '../components/Library/IssueReturn'
import RolesPage from '../components/Administrator/Roles'
import EnrollmentReport from '../components/Reports/EnrollmentReport'

const ProctectRoutes = () => {
  return (
    <Routes>
      <Route path='/dashboard' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<DashboardPage />} />
      </RoleBaseRoute>} />
      <Route path='/academic/class-sections' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<ClassPage />} />
      </RoleBaseRoute>} />
      <Route path='/academic/subjects' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<SubjectsPage />} />
      </RoleBaseRoute>} />
      <Route path='/academic/attendance' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<AttendancePage />} />
      </RoleBaseRoute>} />

      <Route path='/student' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<StudentList />} />
      </RoleBaseRoute>} />
      <Route path='/stutent/add' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<AddStudentPage />} />
      </RoleBaseRoute>} />
      <Route path='/students/id/cards' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<IdCardsPage />} />
      </RoleBaseRoute>} />

      {/* Teacher Routes */}
      <Route path='/teachers' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<TeacherPage />} />
      </RoleBaseRoute>} />
      <Route path='/teachers/add' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<AddTeacherPage />} />
      </RoleBaseRoute>} />

      {/* Administrator Routes */}
      <Route path='/admin/admins' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<AdminsPage />} />
      </RoleBaseRoute>} />
      <Route path='/admin/roles' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<RolesPage />} />
      </RoleBaseRoute>} />
      <Route path='/admin/staff' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<StaffPage />} />
      </RoleBaseRoute>} />

      {/* Academic Additional Routes */}
      <Route path='/academic/study-materials' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<StudyMaterialPage />} />
      </RoleBaseRoute>} />
      <Route path='/academic/homework' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<HomeworkPage />} />
      </RoleBaseRoute>} />
      <Route path='/academic/noticeboard' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<NoticeboardPage />} />
      </RoleBaseRoute>} />
      <Route path='/academic/events' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<EventsPage />} />
      </RoleBaseRoute>} />

      {/* Accounting Routes */}
      <Route path='/accounting/invoices' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<InvoicesPage />} />
      </RoleBaseRoute>} />
      <Route path='/accounting/paid' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<InvoicesPage />} />
      </RoleBaseRoute>} />
      <Route path='/accounting/unpaid' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<InvoicesPage />} />
      </RoleBaseRoute>} />
      <Route path='/accounting/partial' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<InvoicesPage />} />
      </RoleBaseRoute>} />
      <Route path='/accounting/payments' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<PaymentsPage />} />
      </RoleBaseRoute>} />

      {/* Student Additional Routes */}
      <Route path='/students/promotion' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<PromotionPage />} />
      </RoleBaseRoute>} />
      <Route path='/students/transfer' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<TransferPage />} />
      </RoleBaseRoute>} />
      <Route path='/students/certificates' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<CertificatesPage />} />
      </RoleBaseRoute>} />

      {/* Accounting Additional Routes */}
      <Route path='/accounting/expense' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<ExpensePage />} />
      </RoleBaseRoute>} />
      <Route path='/accounting/income' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<IncomePage />} />
      </RoleBaseRoute>} />
      <Route path='/accounting/fee-types' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<FeeTypesPage />} />
      </RoleBaseRoute>} />

      {/* Examination Routes */}
      <Route path='/examination/exams' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<ExamsPage />} />
      </RoleBaseRoute>} />
      <Route path='/examination/results' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<ResultsPage />} />
      </RoleBaseRoute>} />

      {/* Library Routes */}
      <Route path='/library/books' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<BooksPage />} />
      </RoleBaseRoute>} />
      <Route path='/library/issue-return' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<IssueReturnPage />} />
      </RoleBaseRoute>} />

      {/* Reports Routes */}
      <Route path='/reports/enrollment' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<EnrollmentReport />} />
      </RoleBaseRoute>} />

      <Route path='*' element={<PageNotFound />} />
      <Route path='/' element={<Navigate to='/dashboard' />} />
      <Route path='/login' element={<Navigate to='/dashboard' />} />
    </Routes>
  )
}

export default ProctectRoutes