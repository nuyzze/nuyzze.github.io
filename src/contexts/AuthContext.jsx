import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, onValue } from 'firebase/database'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        const userRef = ref(db, `usuarios/${u.uid}`)
        onValue(userRef, (snap) => {
          const data = snap.val()
          setUser({ uid: u.uid, ...data })
          setRole(data?.tipo)
          setLoading(false)
        })
      } else {
        setUser(null)
        setRole(null)
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}