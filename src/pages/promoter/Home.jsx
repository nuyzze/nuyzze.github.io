import React from 'react'
import { auth } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './promoter.css'

export default function PromoterHome(){
  const { user } = useAuth()
  const nav = useNavigate()
  const logOut = ()=>auth.signOut()
  const link = `https://yoryze.app/?ref=${user?.uid}`
  return (
    <div className="home-container">
      <header className="home-header">
        <img src="https://i.imgur.com/mD9vOBI.png" alt="Yoryze" />
      </header>
      <div className="promoter-card">
        <div className="promoter-name">{user?.nome}</div>
        <div className="promoter-link">{link}</div>
      </div>
      <div className="card-grid">
        <HomeCard title="Vendas" onClick={()=>nav('vendas')} icon="📦" />
        <HomeCard title="Comissões" onClick={()=>nav('comissoes')} icon="💰" />
        <HomeCard title="Sair" onClick={logOut} icon="🚪" />
      </div>
    </div>
  )
}

function HomeCard({title,icon,onClick}){
  return(
    <div className="home-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
    </div>
  )
}