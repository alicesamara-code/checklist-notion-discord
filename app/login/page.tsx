"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div className="glass-card" style={{ width: "100%", maxWidth: "400px" }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>Welcome Back</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Log in to manage your Notion syncs</p>
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
                            placeholder="••••••••"
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
                        Sign In
                    </button>
                </form>

                <p style={{ marginTop: "24px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Don't have an account? <Link href="/register" style={{ color: "var(--accent)" }}>Register</Link>
                </p>
            </div>
        </main>
    );
}
