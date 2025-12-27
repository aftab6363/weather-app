"use client";
import { useRouter, usePathname } from "next/navigation";
import "../../src/styles/dashboard.css";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("user");
        router.push("/login"); // Fixed: use router.push instead of navigate
    };

    const isActive = (path) => pathname === path;

    return (
        <div className="dashboard-container">
            <div className="background-animation">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">🌤️</div>
                        <h2 className="sidebar-title">Weather Panel</h2>
                    </div>
                </div>
                <nav className="menu-list">
                    <li className={`menu-item ${isActive("/dashboard") ? "active" : ""}`} onClick={() => router.push("/dashboard")}>
                        <span className="menu-icon">🏠</span>
                        Dashboard
                    </li>
                    <li className={`menu-item ${isActive("/dashboard/profile") ? "active" : ""}`} onClick={() => router.push("/dashboard/profile")}>
                        <span className="menu-icon">👤</span>
                        Profile
                    </li>
                    <li className={`menu-item ${isActive("/dashboard/settings") ? "active" : ""}`} onClick={() => router.push("/dashboard/settings")}>
                        <span className="menu-icon">⚙️</span>
                        Settings
                    </li>
                    <li className="menu-item" onClick={() => router.push("/")}>
                        <span className="menu-icon">🔍</span>
                        Weather Search
                    </li>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            {children}
        </div>
    );
}
