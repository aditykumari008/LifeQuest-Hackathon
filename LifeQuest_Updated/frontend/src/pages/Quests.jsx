import { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, Check, Trash2 } from "lucide-react";

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", category:"coding", difficulty:"medium", quest_type:"daily" });

  const load = () => api.get("/api/quests").then(r => setQuests(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post("/api/quests", form);
    setForm({ title:"", description:"", category:"coding", difficulty:"medium", quest_type:"daily" });
    setShowForm(false);
    load();
  };

  const complete = async (id) => { await api.post(`/api/quests/${id}/complete`); load(); };
  const remove = async (id) => { await api.delete(`/api/quests/${id}`); load(); };

  return (
    <div className="page">
      <div className="page-header split"><div><div className="eyebrow">QUEST MANAGEMENT</div><h1>Quest Board</h1><p>Turn your real-world goals into adventures.</p></div>
      <button className="primary-button" onClick={() => setShowForm(!showForm)}><Plus size={18}/> New Quest</button></div>

      {showForm && <form className="content-card quest-form" onSubmit={create}>
        <h2>Create a Quest</h2>
        <div className="form-grid">
          <label>Quest Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
          <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>coding</option><option>learning</option><option>fitness</option><option>focus</option><option>creative</option></select></label>
          <label>Difficulty<select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option>easy</option><option>medium</option><option>hard</option><option>epic</option></select></label>
          <label>Quest Type<select value={form.quest_type} onChange={e=>setForm({...form,quest_type:e.target.value})}><option>daily</option><option>weekly</option><option>epic</option></select></label>
        </div>
        <label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
        <button className="primary-button">Create Quest</button>
      </form>}

      <div className="quest-grid">
        {quests.map(q => <article className={`quest-card ${q.status}`} key={q.id}>
          <div className="quest-card-top"><span className="tag">{q.quest_type}</span><span className="tag">{q.difficulty}</span></div>
          <h3>{q.title}</h3><p>{q.description || "No description provided."}</p>
          <div className="quest-meta"><span>{q.category}</span><strong>+{q.xp_reward} XP</strong></div>
          <div className="quest-actions">
            {q.status === "active" && <button className="success-button" onClick={()=>complete(q.id)}><Check size={17}/> Complete</button>}
            {q.status === "completed" && <span className="completed-label">Completed ✓</span>}
            <button className="icon-button danger" onClick={()=>remove(q.id)}><Trash2 size={17}/></button>
          </div>
        </article>)}
      </div>
      {!quests.length && <div className="empty">Your quest board is empty. Create your first quest.</div>}
    </div>
  );
}
