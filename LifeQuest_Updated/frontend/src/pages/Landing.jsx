import { Link } from "react-router-dom";
import { Sword, Trophy, Flame, Coins, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand"><span className="brand-mark">⚔</span> LIFEQUEST</div>
        <div className="nav-actions">
          <Link to="/login" className="text-link">Login</Link>
          <Link to="/register" className="primary-button">Start Journey <ArrowRight size={17} /></Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">RPG-POWERED PERSONAL GROWTH</div>
          <h1>Your Life Is The <span>Adventure.</span></h1>
          <p>
            Transform real-world goals into quests. Build your character,
            defeat your biggest challenges, maintain your streak and grow stronger every day.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="primary-button large">Begin Your Journey <ArrowRight size={19} /></Link>
            <a href="#features" className="secondary-button">Explore Features</a>
          </div>
        </div>

        <div className="hero-card">
          <div className="character-orb">⚔</div>
          <div className="level-row"><span>LEVEL 12</span><span>2,450 XP</span></div>
          <div className="xp-bar"><div style={{ width: "72%" }} /></div>
          <div className="hero-stats">
            <div><Flame /> <strong>7</strong><span>Day Streak</span></div>
            <div><Coins /> <strong>680</strong><span>LifeCoins</span></div>
            <div><Trophy /> <strong>14</strong><span>Achievements</span></div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="section-heading">
          <div className="eyebrow">THE LIFEQUEST SYSTEM</div>
          <h2>Real life progress. RPG-level motivation.</h2>
        </div>
        <div className="feature-grid">
          <article><Sword /><h3>Quest System</h3><p>Turn daily goals into meaningful quests with XP and rewards.</p></article>
          <article><Flame /><h3>Streak Power</h3><p>Build consistency and turn daily activity into long-term discipline.</p></article>
          <article><Trophy /><h3>Boss Battles</h3><p>Break your biggest projects into tasks and defeat them step by step.</p></article>
          <article><Coins /><h3>LifeCoin Economy</h3><p>Earn virtual currency and unlock cosmetic rewards.</p></article>
        </div>
      </section>
    </div>
  );
}
