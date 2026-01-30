"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [config, setConfig] = useState({
    notionToken: "",
    notionDatabaseId: "",
    statusProperty: "Status",
    discordWebhookUrl: "",
    selectedStatus: "Pendente",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("/api/config")
        .then((res) => res.json())
        .then((data) => {
          if (data.id) setConfig(data);
          setLoading(false);
        });
    }
  }, [status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    if (res.ok) setMessage("Configuration saved successfully! ✨");
    else setMessage("Error saving configuration ❌");
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage("");
    const res = await fetch("/api/test-now", { method: "POST" });
    setTesting(false);
    if (res.ok) setMessage("Sync executed! Check Discord 🚀");
    else {
      const data = await res.json();
      setMessage(`Error: ${data.error} ❌`);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
      <p>Syncing thoughts...</p>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", padding: "40px 20px" }}>
      <div className="glass-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "4px" }}>Checklist Notion</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Sync your database to Discord effortlessly</p>
          </div>
          <button
            onClick={() => signOut()}
            style={{ background: "transparent", border: "1px solid var(--border)", boxShadow: "none", padding: "8px 16px" }}
          >
            Logout
          </button>
        </header>

        <section>
          <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ gridColumn: "span 2" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", color: "var(--accent)" }}>Connection Settings</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Notion Integration Token</label>
              <input
                type="password"
                placeholder="secret_..."
                value={config.notionToken}
                onChange={(e) => setConfig({ ...config, notionToken: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Notion Database ID</label>
              <input
                type="text"
                placeholder="497... (32 chars)"
                value={config.notionDatabaseId}
                onChange={(e) => setConfig({ ...config, notionDatabaseId: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Status Property Name</label>
              <input
                type="text"
                value={config.statusProperty}
                onChange={(e) => setConfig({ ...config, statusProperty: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Select Status to Sync</label>
              <input
                type="text"
                value={config.selectedStatus}
                onChange={(e) => setConfig({ ...config, selectedStatus: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Discord Webhook URL</label>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                value={config.discordWebhookUrl}
                onChange={(e) => setConfig({ ...config, discordWebhookUrl: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: "span 2", marginTop: "12px" }}>
              <button type="submit" disabled={saving} style={{ width: "100%" }}>
                {saving ? "Saving Changes..." : "Save Configuration"}
              </button>
            </div>
          </form>
        </section>

        <div style={{ height: "1px", background: "var(--border)", margin: "40px 0" }} />

        <section style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Ready to test?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.9rem" }}>
            This will immediately fetch tasks from Notion and send them to your Discord channel.
          </p>
          <button
            onClick={handleTest}
            disabled={testing}
            style={{
              background: "white",
              color: "black",
              width: "auto",
              padding: "14px 40px",
              boxShadow: "0 10px 30px rgba(255,255,255,0.1)"
            }}
          >
            {testing ? "Executing Sync..." : "Sync Now"}
          </button>

          {message && (
            <div style={{
              marginTop: "24px",
              padding: "12px",
              borderRadius: "8px",
              background: message.includes("Error") ? "rgba(255,0,0,0.1)" : "rgba(0,255,0,0.05)",
              color: message.includes("Error") ? "#ff4d4d" : "#4ade80",
              fontSize: "0.9rem",
              border: `1px solid ${message.includes("Error") ? "rgba(255,0,0,0.2)" : "rgba(0,255,0,0.1)"}`
            }}>
              {message}
            </div>
          )}
        </section>
      </div>

      <footer style={{ textAlign: "center", marginTop: "40px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
        Checklist Notion → Discord &copy; 2026
      </footer>
    </main>
  );
}
