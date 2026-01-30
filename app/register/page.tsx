"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.error || "Something went wrong");
        }
    };

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div className="glass-card" style={{ width: "100%", maxWidth: "400px" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>Create Account</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Start syncing Notion with Discord today</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Password</label>
                        <input
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(255,0,0,0.1)", color: "#ff4d4d", fontSize: "0.85rem", textAlign: "center", border: "1px solid rgba(255,0,0,0.2)" }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" style={{ marginTop: "12px" }}>
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: "24px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Already have an account? <Link href="/login" style={{ color: "var(--accent)" }}>Sign In</Link>
                </p>
            </div>
        </main>
    );
}
