import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import './home.css'

export default function UserHome() {
  const nav = useNavigate()
  const logOut = () => auth.signOut()
  return (
    <div className="home-container">
      <header className="home-header">
        <img src="https://i.imgur.com/mD9vOBI.png" alt="Yoryze" />
      </header>
      <div className="card-grid">
        <HomeCard title="Comprar Ingressos" onClick={()=>nav('mesas')} icon="🎫" />
        <HomeCard title="Meus Ingressos" onClick={()=>nav('ingressos')} icon="📄" />
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