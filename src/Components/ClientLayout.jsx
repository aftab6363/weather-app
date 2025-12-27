"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    // Ensure strict match or checking if starts with /dashboard if you want subs too.
    // Original was: location.pathname === "/dashboard"
    // Ensure checks for any dashboard sub-paths and handle strict matching
    const hideLayout = pathname?.startsWith("/dashboard");

    return (
        <div className="app">
            {!hideLayout && <Navbar />}
            {children}
            {!hideLayout && <Footer />}
        </div>
    );
}
