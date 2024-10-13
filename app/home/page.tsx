// Home.tsx
"use client";

import { useEffect } from "react";
import Navbar from "../Navbar";
import WorkoutCard from "./WorkoutCard";
import { useAuth } from "@/context/AuthContext";
import { checkAndCreateUserCollection } from "@/lib/firebase";
import { NavbarItems } from "@/Enums/NavbarEnum";

export default function Home() {
    const { user } = useAuth();
    
    if (!user) {
        return <p>Loading...</p>; // or redirect, show a login button, etc.
    }

    useEffect(() => {
        if (user) {
            checkAndCreateUserCollection(user);
        }
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold">Předchozí tréninky</h1>
            <p className="mt-2">Zde uvidíš přehled všech svých tréninků</p>
            <div className="mt-4 flex flex-col gap-3">
                <WorkoutCard muscleGroup="Prsa/záda" trainingLenght="45m 26s" date="12. 10. 2024" />
                <WorkoutCard muscleGroup="Prsa/záda" trainingLenght="45m 26s" date="12. 10. 2024" />
            </div>
            <Navbar active={NavbarItems.trainings}/>
        </div>
    );
}
