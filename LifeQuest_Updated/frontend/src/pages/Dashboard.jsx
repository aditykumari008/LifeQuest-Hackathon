import { useEffect, useState } from "react";
import api from "../services/api";
import { Flame, Coins, ScrollText, Trophy } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get("/api/dashboard").then(r => setData(r.data)); }, []);
  if (!data) return <div className="loading-page">Loading your command center...</div>;

  const c = data.character;
  const xpPercent = Math.min(100, (c.total_xp / c.next_level_xp) * 100);

  return (
    <div className="page">
      <div className="page-header">
        <div><div className="eyebrow">COMMAND CENTER</div><h1>Welcome back, {data.user.name}.</h1><p>Your next quest is waiting.</p></div>
      </div>

      <section className="hero-panel">
        <div>
          <div className="level-label">LEVEL {c.level} · DIGITAL EXPLORER</div>
          <h2>{c.total_xp} XP earned</h2>
          <div className="xp-bar"><div style={{width: `${xpPercent}%`}} /></div>
          <small>{c.total_xp} / {c.next_level_xp} XP toward next milestone</small>
        </div>
        <div className="hero-sword">⚔</div>
      </section>

      <div className="stats-grid">
        <Stat icon={<Flame />} label="Current Streak" value={`${data.streak.current} days`} />
        <Stat icon={<Coins />} label="LifeCoins" value={data.wallet} />
        <Stat icon={<ScrollText />} label="Completed Quests" value={`${data.completed_quests}/${data.total_quests}`} />
        <Stat icon={<Trophy />} label="Longest Streak" value={`${data.streak.longest} days`} />
      </div>

      <section className="content-card">
        <div className="card-header"><h2>Today's Active Quests</h2></div>
        {data.active_quests.length ? data.active_quests.map(q => (
          <div className="quest-row" key={q.id}>
            <div className="quest-icon">⚔</div>
            <div><strong>{q.title}</strong><span>{q.category} · {q.difficulty}</span></div>
            <div className="reward-text">+{q.xp_reward} XP · +{q.coin_reward} coins</div>
          </div>
        )) : <div className="empty">No active quests. Visit the Quest Board to create one.</div>}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}
