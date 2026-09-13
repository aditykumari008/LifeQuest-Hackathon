import { useEffect, useState } from "react";
import api from "../services/api";

export default function Character() {
  const [c, setC] = useState(null);
  useEffect(()=>{api.get("/api/character").then(r=>setC(r.data));},[]);
  if(!c) return <div className="loading-page">Loading character...</div>;
  const stats = [["🧠","Intelligence",c.intelligence],["💻","Technology",c.technology],["⚡","Focus",c.focus],["🎨","Creativity",c.creativity],["🔥","Discipline",c.discipline],["💪","Strength",c.strength]];
  return <div className="page">
    <div className="page-header"><div><div className="eyebrow">YOUR RPG IDENTITY</div><h1>Character Profile</h1><p>Every completed quest changes who your character becomes.</p></div></div>
    <section className="character-hero"><div className="character-avatar">⚔</div><div><span className="eyebrow">LEVEL {c.level}</span><h2>Digital Explorer</h2><p>{c.total_xp} total experience points earned.</p><div className="xp-bar"><div style={{width:`${Math.min(100,c.total_xp/c.next_level_xp*100)}%`}}/></div></div></section>
    <div className="attribute-list">{stats.map(([icon,name,value])=><div className="attribute-card" key={name}><div className="attribute-head"><span>{icon} {name}</span><strong>{value}</strong></div><div className="attribute-bar"><div style={{width:`${Math.min(100,value)}%`}}/></div></div>)}</div>
  </div>;
}
