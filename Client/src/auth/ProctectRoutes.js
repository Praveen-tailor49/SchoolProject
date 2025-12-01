import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import RoleBaseRoute from './RoleBaseRoute'
import PageNotFound from '../components/Common/PageNotFound'
import AddStudentPage from '../components/Student'

const ProctectRoutes = () => {
  return (
    <Routes>
      <Route path='/dashboard' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={'Home'} />
      </RoleBaseRoute>} />
      <Route path='/student' element={<RoleBaseRoute role={"admin"}>
        <DashboardLayout children={<AddStudentPage/>} />
      </RoleBaseRoute>} />
      <Route path='*' element={<PageNotFound />} />
      <Route path='/' element={<Navigate to='/dashboard' />} />
      <Route path='/login' element={<Navigate to='/dashboard' />} />
    </Routes>
  )
}

export default ProctectRoutes