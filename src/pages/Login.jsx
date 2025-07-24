import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="auth-container">
      <img src="https://i.imgur.com/mD9vOBI.png" alt="Yoryze" className="logo-header" />
      <form onSubmit={handleLogin} className="auth-form">
        <input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
      <Link to="/register" className="link">Cadastre-se</Link>
    </div>
  )
}