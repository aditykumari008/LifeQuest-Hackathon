import { useEffect, useState } from "react";
import api from "../services/api";
import { Sparkles, Target, ArrowRight } from "lucide-react";

export default function Advisor(){
  const [data,setData]=useState(null);
  useEffect(()=>{api.get('/api/advisor').then(r=>setData(r.data)).catch(()=>setData({recommendations:[]}));},[]);
  if(!data) return <div className="loading-page">Reading your adventure data...</div>;
  return <div className="page">
    <div className="page-header"><div><div className="eyebrow">PERSONAL QUEST INTELLIGENCE</div><h1>Smart Advisor</h1><p>Actionable recommendations generated from your LifeQuest progress.</p></div></div>
    <section className="hero-panel advisor-hero"><div><div className="level-label">YOUR NEXT BEST MOVE</div><h2>Progress with purpose.</h2><p>Instead of adding more tasks, LifeQuest helps you decide what deserves attention next.</p></div><Sparkles size={72}/></section>
    <div className="stats-grid">
      <Stat label="Level" value={data.summary?.level ?? 1}/><Stat label="Active" value={data.summary?.active_quests ?? 0}/><Stat label="Completed" value={data.summary?.completed_quests ?? 0}/><Stat label="Streak" value={`${data.summary?.streak ?? 0} days`}/>
    </div>
    <section className="content-card"><div className="card-header"><h2>Recommended Actions</h2></div>
      {data.recommendations.map((r,i)=><div className="advisor-row" key={i}><div className={`priority-dot ${r.priority}`}></div><div><strong>{r.title}</strong><span>{r.message}</span></div><ArrowRight size={18}/></div>)}
    </section>
    {data.focus_quest && <section className="content-card"><div className="card-header"><h2><Target size={19}/> Suggested Focus Quest</h2></div><div className="quest-row"><div className="quest-icon">✦</div><div><strong>{data.focus_quest.title}</strong><span>{data.focus_quest.category} · {data.focus_quest.difficulty}</span></div><div className="reward-text">+{data.focus_quest.xp_reward} XP</div></div></section>}
  </div>
}
function Stat({label,value}){return <div className="stat-card"><div><span>{label}</span><strong>{value}</strong></div></div>}
