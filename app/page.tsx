// app/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
    const { user, login, logout } = useAuth(); // This should work now
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/home"); // Redirect to /home if user is logged in
        }
    }, [user, router]);

    return (
        <div>
            <h1>Welcome to My Next.js App</h1>
            {user ? (
                <div>
                    <p>Hello, {user.displayName}</p>
                    <button onClick={logout}>Log Out</button>
                </div>
            ) : (
                <button onClick={login}>Log In with Google</button>
            )}
        </div>
    );
};

export default HomePage;
