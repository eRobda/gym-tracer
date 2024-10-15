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
            <h1 className="text-2xl font-bold w-full text-center">Gym Tracer</h1>
            {user ? (
                <div>
                    <div>Načítání...</div>
                    {/* <button onClick={logout}>Log Out</button> */}
                </div>
            ) : (
                <button className="mt-5 w-full bg-transparent text-white outline outline-1 rounded-xl py-2 px-3 outline-[#313244]" onClick={login}>Log In with Google</button>
            )}
        </div>
    );
};

export default HomePage;
