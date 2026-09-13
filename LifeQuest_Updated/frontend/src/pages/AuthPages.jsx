import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function Login() {
  const { login, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to login");
    }
  };

  return <AuthLayout title="Welcome Back, Adventurer" subtitle="Enter LifeQuest and continue your journey.">
    <form onSubmit={submit} className="auth-form">
      {error && <div className="error-box">{error}</div>}
      <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} /></label>
      <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form, password:e.target.value})} /></label>
      <button className="primary-button full" disabled={loading}>{loading ? "Entering..." : "Enter LifeQuest"}</button>
      <p>New adventurer? <Link to="/register">Begin your journey</Link></p>
    </form>
  </AuthLayout>;
}

export function Register() {
  const { register, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create account");
    }
  };

  return <AuthLayout title="Create Your Adventurer" subtitle="Your real-world growth starts here.">
    <form onSubmit={submit} className="auth-form">
      {error && <div className="error-box">{error}</div>}
      <label>Name<input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} /></label>
      <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} /></label>
      <label>Password<input type="password" minLength="6" required value={form.password} onChange={e => setForm({...form, password:e.target.value})} /></label>
      <button className="primary-button full" disabled={loading}>{loading ? "Creating..." : "Create Adventurer"}</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <Link to="/" className="brand auth-brand"><span className="brand-mark">⚔</span> LIFEQUEST</Link>
      <div className="auth-card">
        <div className="eyebrow">BEGIN YOUR ADVENTURE</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
