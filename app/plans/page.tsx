"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext"; // Import useAuth to get the current user
import { getWorkoutPlans } from "@/lib/firebase"; // Import the function to fetch workout plans
import { WorkoutPlan } from "@/interfaces/workoutPlan"; // Import the WorkoutPlan interface
import { NavbarItems } from "@/Enums/NavbarEnum";
import WorkoutPlanCard from "./WorkoutPlanCard";

export default function WorkoutPlans() {
    const { user } = useAuth(); // Get the logged-in user
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]); // Use WorkoutPlan[] interface

    useEffect(() => {
        const fetchWorkoutPlans = async () => {
            if (user) {
                const plans = await getWorkoutPlans(user.uid); // Fetch workout plans
                setWorkoutPlans(plans); // Set plans in state
            }
        };

        fetchWorkoutPlans();
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold">Moje tréninkové plány</h1>
            <p>Zde si můžeš upravit nebo vytvořit své vlastní tréninkové plány.</p>
            <div className="mt-4 flex flex-col gap-3">
                {workoutPlans.length > 0 ? (
                    workoutPlans.map((plan, index) => (
                        <WorkoutPlanCard key={index} planName={plan.planName} exercises={plan.exercises}/>
                    ))
                ) : (
                    <p>Žádné plány nenalezeny.</p>
                )}
                <Link href="plans/add" className="outline outline-1 bg-green-700 outline-[#313244] py-2 px-3 rounded-xl text-center">
                    Přidat nový plán
                </Link>
            </div>
            <Navbar active={NavbarItems.plans}/>
        </div>
    );
}
