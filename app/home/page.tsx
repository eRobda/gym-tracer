"use client"

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useAuth } from "@/context/AuthContext";
import { checkAndCreateUserCollection, getWorkoutHistory } from "@/lib/firebase";
import { NavbarItems } from "@/Enums/NavbarEnum";
import WorkoutCard from "./WorkoutCard";
import Link from "next/link";

interface WorkoutLog {
    muscleGroup: string;
    workoutLength: string;
    date: string;
}

export default function Home() {
    const { user } = useAuth();
    const [workoutHistory, setWorkoutHistory] = useState<WorkoutLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutHistory = async () => {
            if (user) {
                checkAndCreateUserCollection(user);
                const history = await getWorkoutHistory(user.uid);
                setWorkoutHistory(history);
            }
            setLoading(false);
        };

        fetchWorkoutHistory();
    }, [user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Please log in to see your workouts.</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Předchozí tréninky</h1>
            <p className="mt-2">Zde uvidíš přehled všech svých tréninků</p>
            <div className="mt-4 flex flex-col gap-3">
                {workoutHistory.length > 0 ? (
                    workoutHistory.map((workout, index) => (
                        <WorkoutCard
                            key={index}
                            muscleGroup={workout.muscleGroup}
                            trainingLenght={workout.workoutLength}
                            date={new Date(workout.date).toLocaleDateString()}
                        />
                    ))
                ) : (
                    <p>Nenalezeny žádné předchozí tréninky.</p>
                )}
            </div>
            <Link href="home/workout">
                <button className="mt-3 w-full bg-transparent text-green-500 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]">
                    Zahájit trénink
                </button>
            </Link>

            <Navbar active={NavbarItems.trainings} />
        </div>
    );
}
