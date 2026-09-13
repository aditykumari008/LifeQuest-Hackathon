import { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function Streaks() {
  const [s,setS]=useState(null);
  useEffect(()=>{api.get("/api/streak").then(r=>setS(r.data));},[]);
  if(!s)return <div className="loading-page">Loading streak...</div>;
  return <div className="page"><div className="page-header"><div><div className="eyebrow">CONSISTENCY ENGINE</div><h1>Streak Temple</h1><p>Show up every day and build discipline.</p></div></div><section className="streak-hero"><div className="giant-flame">🔥</div><div><span>CURRENT STREAK</span><h2>{s.current} DAYS</h2><p>Your longest streak is {s.longest} days.</p></div></section><div className="milestone-grid"><div>🌱<strong>3 Days</strong><span>Beginner Flame</span></div><div>🔥<strong>7 Days</strong><span>Rising Flame</span></div><div>⚡<strong>30 Days</strong><span>Discipline Warrior</span></div><div>👑<strong>100 Days</strong><span>Legendary Consistency</span></div></div></div>;
}

export function Achievements() {
  const [items,setItems]=useState([]);
  useEffect(()=>{api.get("/api/achievements").then(r=>setItems(r.data));},[]);
  return <div className="page"><div className="page-header"><div><div className="eyebrow">COLLECTION</div><h1>Achievement Hall</h1><p>Milestones earned through real-world action.</p></div></div><div className="achievement-grid">{items.map(a=><article className={`achievement-card ${a.unlocked?"unlocked":"locked"}`} key={a.id}><div className="achievement-icon">{a.unlocked?"🏆":"🔒"}</div><h3>{a.name}</h3><p>{a.description}</p><span>Reward: {a.reward_coins} coins</span></article>)}</div></div>;
}

export function Shop() {
  const [data,setData]=useState(null);
  const load=()=>api.get("/api/rewards").then(r=>setData(r.data));
  useEffect(()=>{load();},[]);
  const buy=async id=>{try{await api.post(`/api/rewards/${id}/buy`);load();}catch(e){alert(e.response?.data?.detail||"Purchase failed");}};
  if(!data)return <div className="loading-page">Loading shop...</div>;
  return <div className="page"><div className="page-header"><div><div className="eyebrow">VIRTUAL ECONOMY</div><h1>LifeCoin Shop</h1><p>Balance: <strong>{data.balance} LifeCoins</strong></p></div></div><div className="shop-grid">{data.items.map(i=><article className="shop-card" key={i.id}><div className="shop-icon">✨</div><h3>{i.name}</h3><p>{i.description}</p><strong>{i.price} LifeCoins</strong><button disabled={i.owned} className={i.owned?"owned-button":"primary-button full"} onClick={()=>buy(i.id)}>{i.owned?"Owned":"Purchase"}</button></article>)}</div></div>;
}

export function Analytics() {
  const [data,setData]=useState(null);
  useEffect(()=>{api.get("/api/analytics").then(r=>setData(r.data));},[]);
  if(!data)return <div className="loading-page">Loading analytics...</div>;
  return <div className="page"><div className="page-header"><div><div className="eyebrow">PRODUCTIVITY INTELLIGENCE</div><h1>Analytics</h1><p>See how your adventure is progressing.</p></div></div><div className="stats-grid"><div className="stat-card"><div><span>Total Quests</span><strong>{data.total}</strong></div></div><div className="stat-card"><div><span>Completed</span><strong>{data.completed}</strong></div></div><div className="stat-card"><div><span>Active</span><strong>{data.active}</strong></div></div><div className="stat-card"><div><span>Completion Rate</span><strong>{data.completion_rate}%</strong></div></div></div><section className="content-card chart-card"><h2>Quest Categories</h2>{data.categories.length?<div className="chart-wrap"><ResponsiveContainer width="100%" height={320}><PieChart><Pie data={data.categories} dataKey="value" nameKey="name" outerRadius={105} label>{data.categories.map((_,i)=><Cell key={i}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>:<div className="empty">Create quests to generate analytics.</div>}</section></div>;
}
