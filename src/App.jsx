import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import UserHome from './pages/user/Home'
import AdminHome from './pages/admin/Home'
import PromoterHome from './pages/promoter/Home'

const ProtectedRoute = ({ children, allowed }) => {
  const { loading, role } = useAuth()
  if (loading) return <Splash />
  if (!role) return <Navigate to="/login" />
  if (!allowed.includes(role)) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <WrappedHome />
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowed={["colaborador"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promoter/*"
          element={
            <ProtectedRoute allowed={["promoter"]}>
              <PromoterHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowed={["usuario"]}>
              <UserHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

function WrappedHome() {
  const { role, loading } = useAuth()
  if (loading) return <Splash />
  if (role === 'usuario') return <Navigate to="/user" />
  if (role === 'colaborador') return <Navigate to="/admin" />
  if (role === 'promoter') return <Navigate to="/promoter" />
  return <Navigate to="/login" />
}