"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main style={{ minHeight: "100vh", padding: "0 20px" }}>
      {/* Navigation */}
      <nav style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "30px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", fontFamily: "Outfit" }}>
          Checklist<span style={{ color: "var(--accent)" }}>Sync</span>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {session ? (
            <Link href="/dashboard">
              <button style={{ padding: "8px 20px" }}>Go to Dashboard</button>
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: "0.9rem" }}>Login</Link>
              <Link href="/register">
                <button style={{ padding: "8px 20px" }}>Get Started</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: "1000px",
        margin: "100px auto",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "4rem", lineHeight: "1.1", marginBottom: "24px" }}>
          Automate your <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Notion Checklists</span> to Discord
        </h1>
        <p style={{
          color: "var(--text-secondary)",
          fontSize: "1.25rem",
          maxWidth: "700px",
          margin: "0 auto 40px",
          lineHeight: "1.6"
        }}>
          Stop manually checking your Notion databases. Connect your tasks once and get automated checklist updates in your Discord channel based on your schedule.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link href="/register">
            <button style={{ padding: "16px 48px", fontSize: "1.1rem" }}>Start for Free</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        maxWidth: "1100px",
        margin: "150px auto",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px"
      }}>
        <div className="glass-card" style={{ padding: "40px", textAlign: "left" }}>
          <div style={{ fontSize: "2rem", marginBottom: "20px" }}>📂</div>
          <h3 style={{ marginBottom: "12px", fontSize: "1.25rem" }}>Notion Integration</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Connect to any Notion database using official integration tokens. Secure and robust.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "40px", textAlign: "left" }}>
          <div style={{ fontSize: "2rem", marginBottom: "20px" }}>💬</div>
          <h3 style={{ marginBottom: "12px", fontSize: "1.25rem" }}>Discord Webhooks</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Instant formatting. Your tasks become beautiful checklists directly in your Discord channel.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "40px", textAlign: "left" }}>
          <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
          <h3 style={{ marginBottom: "12px", fontSize: "1.25rem" }}>Smart Filtering</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Choose exactly which status to sync. No more clutter, only the tasks that matter now.
          </p>
        </div>
      </section>

      {/* Social Proof / Call to action */}
      <section className="glass-card" style={{
        maxWidth: "1000px",
        margin: "150px auto",
        textAlign: "center",
        background: "linear-gradient(rgba(88, 101, 242, 0.1), rgba(0,0,0,0))",
        border: "1px solid rgba(88, 101, 242, 0.2)"
      }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>Ready to boost your productivity?</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
          Join users who are automating their workflows today.
        </p>
        <Link href="/register">
          <button style={{ padding: "14px 40px" }}>Create Your Account</button>
        </Link>
      </section>

      <footer style={{
        textAlign: "center",
        padding: "60px 0",
        color: "var(--text-secondary)",
        fontSize: "0.9rem",
        borderTop: "1px solid var(--border)",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        &copy; 2026 ChecklistSync. All rights reserved. Built for automation enthusiasts.
      </footer>
    </main>
  );
}
