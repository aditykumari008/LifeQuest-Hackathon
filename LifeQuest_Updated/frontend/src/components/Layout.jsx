import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard, ScrollText, UserRound, Sword, Flame, Trophy,
  Store, ChartNoAxesCombined, LogOut, Sparkles, Map
} from "lucide-react";

const links = [
  ["/dashboard", "Command Center", LayoutDashboard],
  ["/quests", "Quest Board", ScrollText],
  ["/character", "Character", UserRound],
  ["/bosses", "Boss Battles", Sword],
  ["/streaks", "Streak Temple", Flame],
  ["/achievements", "Achievement Hall", Trophy],
  ["/shop", "LifeCoin Shop", Store],
  ["/analytics", "Analytics", ChartNoAxesCombined],
  ["/advisor", "Smart Advisor", Sparkles],
  ["/world", "Living World", Map],
];

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/dashboard" className="brand">
          <span className="brand-mark">⚔</span>
          <span>LIFEQUEST</span>
        </NavLink>

        <div className="nav-links">
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} className="nav-link">
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{user?.name?.[0]?.toUpperCase() || "A"}</div>
            <div>
              <strong>{user?.name || "Adventurer"}</strong>
              <small>LifeQuest Player</small>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
  
}
