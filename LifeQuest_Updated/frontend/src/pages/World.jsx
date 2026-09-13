import { useEffect, useState } from "react";
import api from "../services/api";
import { LockKeyhole, Map, Flag } from "lucide-react";

export default function World(){
 const [data,setData]=useState(null);
 useEffect(()=>{api.get('/api/world').then(r=>setData(r.data));},[]);
 if(!data) return <div className="loading-page">Building your world...</div>;
 return <div className="page"><div className="page-header"><div><div className="eyebrow">YOUR PROGRESSION MAP</div><h1>Living World</h1><p>As your real-life progress grows, new regions of LifeQuest unlock.</p></div></div>
 <section className="world-banner"><Map size={44}/><div><strong>Explorer Level {data.level}</strong><span>{data.completed_quests} completed quests have shaped your world.</span></div></section>
 <div className="world-grid">{data.zones.map(z=><article className={`zone-card ${z.status}`} key={z.id}><div className="zone-top">{z.status==='locked'?<LockKeyhole/>:<Flag/>}<span>{z.status==='locked'?`Unlocks at Level ${z.unlock_level}`:'Unlocked'}</span></div><h2>{z.name}</h2><p>{z.description}</p><div className="zone-progress">{z.status==='locked'?'Keep leveling to discover this region.':'This region is part of your active adventure.'}</div></article>)}</div></div>
}
