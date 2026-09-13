import { useEffect, useState } from "react";
import api from "../services/api";

export default function Bosses() {
  const [bosses,setBosses]=useState([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:"",description:"",total_hp:1000,xp_reward:1000,coin_reward:200,tasks:[{title:"",damage:200}]});
  const load=()=>api.get("/api/bosses").then(r=>setBosses(r.data));
  useEffect(()=>{load();},[]);

  const create=async e=>{e.preventDefault();await api.post("/api/bosses",form);setShow(false);setForm({title:"",description:"",total_hp:1000,xp_reward:1000,coin_reward:200,tasks:[{title:"",damage:200}]});load();};
  const complete=async id=>{await api.post(`/api/bosses/tasks/${id}/complete`);load();};
  const updateTask=(i,key,val)=>{const tasks=[...form.tasks];tasks[i][key]=key==="damage"?Number(val):val;setForm({...form,tasks});};

  return <div className="page">
    <div className="page-header split"><div><div className="eyebrow">EPIC GOALS</div><h1>Boss Battles</h1><p>Break large projects into smaller attacks and defeat them.</p></div><button className="primary-button" onClick={()=>setShow(!show)}>Create Boss Battle</button></div>
    {show&&<form className="content-card quest-form" onSubmit={create}><h2>New Boss Battle</h2><div className="form-grid"><label>Boss Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Total HP<input type="number" value={form.total_hp} onChange={e=>setForm({...form,total_hp:Number(e.target.value)})}/></label></div><label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><h3>Boss Tasks</h3>{form.tasks.map((t,i)=><div className="task-input-row" key={i}><input placeholder="Task title" required value={t.title} onChange={e=>updateTask(i,"title",e.target.value)}/><input type="number" placeholder="Damage" value={t.damage} onChange={e=>updateTask(i,"damage",e.target.value)}/></div>)}<button type="button" className="secondary-button" onClick={()=>setForm({...form,tasks:[...form.tasks,{title:"",damage:200}]})}>Add Task</button><br/><br/><button className="primary-button">Create Battle</button></form>}
    <div className="boss-list">{bosses.map(b=>{const pct=b.total_hp?b.current_hp/b.total_hp*100:0;return <article className="boss-card" key={b.id}><div className="boss-top"><div><span className="tag">{b.status}</span><h2>🐉 {b.title}</h2><p>{b.description}</p></div><div className="boss-reward">+{b.xp_reward} XP<br/>+{b.coin_reward} coins</div></div><div className="hp-label"><span>Boss Health</span><strong>{b.current_hp} / {b.total_hp} HP</strong></div><div className="boss-hp"><div style={{width:`${pct}%`}}/></div><div className="boss-tasks">{b.tasks.map(t=><div className="boss-task" key={t.id}><span>{t.status==="completed"?"✓":"○"}</span><span>{t.title}</span><strong>-{t.damage} HP</strong>{t.status==="active"&&b.status==="active"&&<button className="success-button" onClick={()=>complete(t.id)}>Attack</button>}</div>)}</div></article>})}</div>
    {!bosses.length&&<div className="empty">No boss battles yet. Turn your biggest goal into one.</div>}
  </div>;
}
