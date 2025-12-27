"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../../src/styles/dashboard.css";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    // Password Form State
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedUser") || localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push("/login");
        }
    }, [router]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const userId = user._id || user.id;

        try {
            const res = await fetch("/api/user/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, oldPassword, newPassword }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage("Password updated successfully!");
                setOldPassword("");
                setNewPassword("");
            } else {
                setError(data.message || "Failed to update password");
            }
        } catch (err) {
            setError("Server Error");
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        const userId = user._id || user.id;

        try {
            const res = await fetch(`/api/user/${userId}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success) {
                localStorage.removeItem("loggedUser");
                localStorage.removeItem("user");
                alert("Account deleted successfully.");
                router.push("/");
            } else {
                alert(data.message || "Failed to delete account");
            }
        } catch (err) {
            alert("Failed to connect to server");
        }
    };

    if (!user) return <div style={{ color: "white", padding: "40px" }}>Loading Settings...</div>;

    return (
        <main className="main-content">
            <div className="header-section">
                <div>
                    <h1 className="welcome">Settings</h1>
                    <p className="subtitle">Update security and preferences.</p>
                </div>
            </div>

            <div className="settings-container" style={{ maxWidth: "700px", marginTop: "30px" }}>

                {/* Change Password Section */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    padding: "30px",
                    borderRadius: "20px",
                    marginBottom: "30px",
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                }}>
                    <h2 style={{ color: "white", marginBottom: "20px", fontSize: "20px" }}>Change Password</h2>

                    <form onSubmit={handleChangePassword}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", color: "#cbd5e1", marginBottom: "8px", fontSize: "14px" }}>Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    background: "rgba(0,0,0,0.2)",
                                    color: "white",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", color: "#cbd5e1", marginBottom: "8px", fontSize: "14px" }}>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    background: "rgba(0,0,0,0.2)",
                                    color: "white",
                                    outline: "none"
                                }}
                            />
                        </div>

                        {message && <p style={{ color: "#4ade80", marginBottom: "15px" }}>{message}</p>}
                        {error && <p style={{ color: "#f87171", marginBottom: "15px" }}>{error}</p>}

                        <button type="submit" style={{
                            padding: "10px 20px",
                            borderRadius: "10px",
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "15px"
                        }}>
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Delete Account Section */}
                <div style={{
                    background: "rgba(220, 38, 38, 0.15)",
                    backdropFilter: "blur(10px)",
                    padding: "30px",
                    borderRadius: "20px",
                    border: "1px solid rgba(239, 68, 68, 0.3)"
                }}>
                    <h2 style={{ color: "#fca5a5", marginBottom: "15px", fontSize: "20px" }}>Danger Zone</h2>
                    <p style={{ color: "#fecaca", marginBottom: "20px", fontSize: "14px" }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button onClick={handleDeleteAccount} style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "15px"
                    }}>
                        Delete Account
                    </button>
                </div>

            </div>
        </main>
    );
}
