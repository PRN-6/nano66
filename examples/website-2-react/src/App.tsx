import React, { useEffect, useRef, useState } from "react";
import { Nano66 } from "nano66";

interface Project {
  id: string;
  category: "compute" | "storage" | "ai";
  title: string;
  description: string;
}

const PROJECTS: Project[] = [
  {
    id: "p1",
    category: "compute",
    title: "Quantum Kernel 4.0",
    description: "Distributed execution scheduler optimizing serverless workloads with zero latency overhead.",
  },
  {
    id: "p2",
    category: "ai",
    title: "Neural Pipeline X",
    description: "Streaming tensor processing pipeline capable of handling billions of inference tokens per second.",
  },
  {
    id: "p3",
    category: "storage",
    title: "Immutable Lakehouse",
    description: "Cryptographically verified high-throughput analytical store designed for real-time auditability.",
  },
];

export const App: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [counter, setCounter] = useState<number>(99);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Initializing");

  const nanoRef = useRef<Nano66 | null>(null);

  useEffect(() => {
    // 1. Initialize Nano66 on React DOM mount
    const nano = new Nano66({
      target: "#react-app-wrapper",
      theme: "auto",
      animation: {
        mode: "sequential",
        elementDelay: 200,
        cursorExit: true,
      },
      particles: {
        count: 4000,
        speed: 1.2,
        glow: true,
      },
    });

    nanoRef.current = nano;

    nano.on("ready", () => setStatus("Ready"));
    nano.on("start", () => setStatus("Constructing"));
    nano.on("complete", () => setStatus("Interactive"));

    nano.start().catch((err) => {
      console.error("[Nano66-React] Initialization failed:", err);
    });

    // 2. Continuous counter to verify React re-renders do NOT break the canvas / animation
    const interval = setInterval(() => {
      setCounter((c) => (c >= 999 ? 100 : c + 1));
    }, 1500);

    // 3. Clean up properly on unmount
    return () => {
      clearInterval(interval);
      nano.destroy();
      nanoRef.current = null;
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleRestart = () => {
    nanoRef.current?.restart();
  };

  const handleSkip = () => {
    nanoRef.current?.skip();
  };

  const filteredProjects =
    activeCategory === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* HUD Bar (Ignored by Nano66) */}
      <div className="hud-bar" data-nano-ignore>
        <span className="hud-tag">Nano66 React</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{status}</span>
        <button className="hud-btn" onClick={handleRestart} title="Restart particle animation">
          ↺ Restart
        </button>
        <button className="hud-btn" onClick={handleSkip} title="Skip animation">
          ⏭ Skip
        </button>
        <button className="hud-btn" onClick={toggleTheme} title="Toggle theme">
          🌓 {theme.toUpperCase()}
        </button>
      </div>

      <div id="react-app-wrapper">
        {/* Navigation */}
        <header className="react-nav container" data-nano-order="1">
          <div className="nav-brand" data-nano-order="2">
            <span className="nav-dot"></span>
            <span>QUANTUMPULSE</span>
          </div>
          <nav className="nav-menu">
            <a href="#metrics">Platform</a>
            <a href="#projects">Architecture</a>
            <a href="#contact">Enterprise</a>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section className="react-hero container">
            <div className="hero-pill" data-nano-order="2">
              ✦ QUANTUM COMPUTE CLOUD 2026
            </div>
            <h1 data-nano-order="3">
              Hyper-speed compute infrastructure for global workloads.
            </h1>
            <p className="hero-sub" data-nano-order="4">
              Eliminate cold starts and compute bottlenecks with our globally distributed,
              sub-millisecond execution engine.
            </p>
            <div className="hero-btns" data-nano-order="5">
              <button className="action-btn primary">Deploy Cluster</button>
              <button className="action-btn ghost">Read Benchmark</button>
            </div>
          </section>

          {/* Animated Metrics Section */}
          <section id="metrics" className="metrics-section container">
            <div className="metrics-grid" data-nano-order="6">
              <div className="metric-card">
                <div className="metric-value">{counter}µs</div>
                <div className="metric-label">Execution Latency</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">99.999%</div>
                <div className="metric-label">Uptime Reliability</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">4.2 TB/s</div>
                <div className="metric-label">Throughput Bandwidth</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">180+</div>
                <div className="metric-label">Edge Data Centers</div>
              </div>
            </div>
          </section>

          {/* Dynamic Project Filtering */}
          <section id="projects" className="container" style={{ padding: "4rem 0" }}>
            <div className="projects-header" data-nano-order="7">
              <h2>Infrastructure Core</h2>
              <div className="category-tabs">
                {["all", "compute", "storage", "ai"].map((cat) => (
                  <button
                    key={cat}
                    className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-3" data-nano-order="8">
              {filteredProjects.map((p) => (
                <article key={p.id} className="react-card card" data-nano-card>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--accent)",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    [{p.category.toUpperCase()}]
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Contact Form */}
          <section id="contact" className="form-section container">
            <div className="form-wrapper" data-nano-order="9">
              <h2 className="form-title">Request Enterprise Access</h2>
              <p className="form-desc">
                Deploy private clusters with custom compute nodes and dedicated VPC peering.
              </p>

              {submitted ? (
                <div style={{ textAlign: "center", color: "var(--accent)", padding: "2rem" }}>
                  ✓ Request received. Our infrastructure team will reach out shortly.
                </div>
              ) : (
                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="form-group">
                    <label>Work Email</label>
                    <input type="email" placeholder="you@company.com" required />
                  </div>
                  <div className="form-group">
                    <label>Compute Requirements</label>
                    <textarea rows={3} placeholder="Describe workload requirements..." required />
                  </div>
                  <button type="submit" className="action-btn primary" style={{ width: "100%" }}>
                    Submit Access Request
                  </button>
                </form>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="react-footer container" data-nano-order="10">
          <p>&copy; 2026 QuantumPulse Technologies Inc. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};
