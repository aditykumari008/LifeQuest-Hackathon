import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import { Login, Register } from "./pages/AuthPages";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Character from "./pages/Character";
import Bosses from "./pages/Bosses";
import { Streaks, Achievements, Shop, Analytics } from "./pages/Extras";
import Advisor from "./pages/Advisor";
import World from "./pages/World";

function PrivatePage({ children }) {
  return <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<PrivatePage><Dashboard/></PrivatePage>}/>
        <Route path="/quests" element={<PrivatePage><Quests/></PrivatePage>}/>
        <Route path="/character" element={<PrivatePage><Character/></PrivatePage>}/>
        <Route path="/bosses" element={<PrivatePage><Bosses/></PrivatePage>}/>
        <Route path="/streaks" element={<PrivatePage><Streaks/></PrivatePage>}/>
        <Route path="/achievements" element={<PrivatePage><Achievements/></PrivatePage>}/>
        <Route path="/shop" element={<PrivatePage><Shop/></PrivatePage>}/>
        <Route path="/analytics" element={<PrivatePage><Analytics/></PrivatePage>}/>
        <Route path="/advisor" element={<PrivatePage><Advisor/></PrivatePage>}/>
        <Route path="/world" element={<PrivatePage><World/></PrivatePage>}/>
        <Route path="*" element={<Landing/>}/>
      </Routes>
    </AuthProvider>
  );
}
