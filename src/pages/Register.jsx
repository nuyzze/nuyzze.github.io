import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== confirm) return alert('Senhas não coincidem')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await set(ref(db, `usuarios/${cred.user.uid}`), {
        nome: name,
        email,
        telefone: phone,
        tipo: 'usuario',
        criadoEm: new Date().toISOString()
      })
      navigate('/login')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="auth-container">
      <img src="https://i.imgur.com/mD9vOBI.png" alt="Yoryze" className="logo-header" />
      <form onSubmit={handleRegister} className="auth-form">
        <input placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input placeholder="Telefone" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
        <input placeholder="Senha" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <input placeholder="Confirmar Senha" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
        <button type="submit" className="btn-primary">Cadastrar</button>
      </form>
      <Link to="/login" className="link">Voltar</Link>
    </div>
  )
}