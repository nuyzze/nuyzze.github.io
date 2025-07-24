import React from 'react'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import './admin.css'

export default function AdminHome() {
  const nav = useNavigate()
  const logOut = () => auth.signOut()
  return (
    <div className="home-container">
      <header className="home-header">
        <img src="https://i.imgur.com/mD9vOBI.png" alt="Yoryze" />
        <h2>Painel Administrativo</h2>
      </header>
      <div className="card-grid">
        <HomeCard title="Dashboard" onClick={()=>nav('dashboard')} icon="📊" />
        <HomeCard title="Mesas" onClick={()=>nav('mesas')} icon="🪑" />
        <HomeCard title="Ingressos" onClick={()=>nav('ingressos')} icon="🎫" />
        <HomeCard title="Scanner" onClick={()=>nav('scanner')} icon="📷" />
        <HomeCard title="Convidados" onClick={()=>nav('convidados')} icon="🧑‍🤝‍🧑" />
        <HomeCard title="Sair" onClick={logOut} icon="🚪" />
      </div>
    </div>
  )
}

function HomeCard({title,onClick,icon}){
  return (
    <div className="home-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
    </div>
  )
}