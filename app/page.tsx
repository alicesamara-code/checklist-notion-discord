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
    if (res.ok) setMessage("Config saved successfully!");
    else setMessage("Error saving config");
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage("");
    const res = await fetch("/api/test-now", { method: "POST" });
    setTesting(false);
    if (res.ok) setMessage("Discord message sent!");
    else {
      const data = await res.json();
      setMessage(`Error: ${data.error}`);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Checklist Notion → Discord</h1>
        <button onClick={() => signOut()}>Logout</button>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <label>
          Notion Integration Token:
          <input
            type="password"
            value={config.notionToken}
            onChange={(e) => setConfig({ ...config, notionToken: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
        <label>
          Notion Database ID:
          <input
            type="text"
            value={config.notionDatabaseId}
            onChange={(e) => setConfig({ ...config, notionDatabaseId: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
        <label>
          Status Property Name:
          <input
            type="text"
            value={config.statusProperty}
            onChange={(e) => setConfig({ ...config, statusProperty: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
        <label>
          Status Value to Filter (ex: Pendente):
          <input
            type="text"
            value={config.selectedStatus}
            onChange={(e) => setConfig({ ...config, selectedStatus: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>
        <label>
          Discord Webhook URL:
          <input
            type="text"
            value={config.discordWebhookUrl}
            onChange={(e) => setConfig({ ...config, discordWebhookUrl: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <button onClick={handleTest} disabled={testing} style={{ padding: "10px", width: "100%", backgroundColor: "#5865F2", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer" }}>
        {testing ? "Testing..." : "Test Now"}
      </button>

      {message && <p style={{ marginTop: "10px", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
    </div>
  );
}
