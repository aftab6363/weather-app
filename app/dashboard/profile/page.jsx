"use client";
import React, { useEffect, useState } from "react";
import "../../../src/styles/dashboard.css"; // Reuse dashboard styles

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedUser") || localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return <div style={{ color: "white", padding: "40px" }}>Loading Profile...</div>;
    }

    return (
        <main className="main-content">
            <div className="header-section">
                <div>
                    <h1 className="welcome">My Profile</h1>
                    <p className="subtitle">Manage your personal information.</p>
                </div>
            </div>

            <div className="profile-container" style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                padding: "40px",
                borderRadius: "24px",
                marginTop: "30px",
                maxWidth: "600px"
            }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #00feba, #5b548a)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        marginRight: "20px"
                    }}>
                        👤
                    </div>
                    <div>
                        <h2 style={{ fontSize: "24px", color: "white", marginBottom: "5px" }}>{user.username || user.name || "User"}</h2>
                        <div style={{ color: "#a0aaec" }}>Member</div>
                    </div>
                </div>

                <div className="profile-details" style={{ color: "#dbeafe" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", color: "#94a3b8", marginBottom: "5px" }}>Email Address</label>
                        <div style={{ fontSize: "18px" }}>{user.email}</div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", color: "#94a3b8", marginBottom: "5px" }}>User ID</label>
                        <div style={{ fontSize: "14px", fontFamily: "monospace", opacity: 0.8 }}>{user._id || user.id || "N/A"}</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
