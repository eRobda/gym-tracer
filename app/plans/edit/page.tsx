"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateWorkoutPlan, getWorkoutPlans, deleteWorkoutPlan } from "@/lib/firebase"; // Import updateWorkoutPlan
import { WorkoutPlan, Exercise } from "@/interfaces/workoutPlan"; // Import interfaces
import { ExerciseItem } from "../ExerciseItem";

export default function EditWorkoutPlan() {
    const { user } = useAuth();
    const [planName, setPlanName] = useState<string>("");
    const [exercises, setExercises] = useState<Exercise[]>([]); // Use Exercise interface
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPlanName = searchParams.get("planName");
    const [oldPlanName, setOldPlanName] = useState<string>(""); // Store old plan name here

    useEffect(() => {
        if (user && initialPlanName) {
            const fetchPlans = async () => {
                const plans: WorkoutPlan[] = await getWorkoutPlans(user.uid); // Ensure the return type is WorkoutPlan[]
                const selectedPlan = plans.find((plan) => plan.planName === initialPlanName);
                if (selectedPlan) {
                    setPlanName(selectedPlan.planName);
                    setExercises(selectedPlan.exercises);
                    setOldPlanName(selectedPlan.planName); // Store old plan name here
                }
            };
            fetchPlans();
        }
    }, [user, initialPlanName]);

    const savePlan = async () => {
        if (!user || !planName) return;

        const updatedPlan: WorkoutPlan = {
            planName,
            exercises,
        };

        await updateWorkoutPlan(user.uid, oldPlanName, updatedPlan); // Pass the whole updated plan object
        console.log("Workout plan updated.");
        router.push("/plans"); // Redirect to /plans after updating the plan
    };

    const deletePlan = async () => {
        if (!user || !planName) return;
        await deleteWorkoutPlan(user.uid, oldPlanName);
        console.log("Workout plan deleted.");
        router.push("/plans"); // Redirect to /plans after updating the plan
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Upravit tréninkový plán</h1>

            <div className="flex flex-col mt-4">
                <div className="flex flex-col gap-1">
                    <p>Název plánu</p>
                    <input
                        className="bg-transparent outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                        type="text"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="Prsa/Záda"
                    />
                </div>

                <div className="w-full h-[1px] bg-[#313244] mt-4"></div>

                <div className="flex flex-col gap-2">
                    {exercises.map((exercise, index) => (
                        <ExerciseItem
                            key={index}
                            index={index}
                            exercise={exercise}
                            onDelete={() => setExercises((prev) => prev.filter((_, i) => i !== index))}
                            onUpdate={(updatedExercise: Exercise) =>
                                setExercises((prev) =>
                                    prev.map((ex, i) => (i === index ? updatedExercise : ex))
                                )
                            }
                        />
                    ))}
                </div>

                <button
                    className="mt-4 bg-blue-600 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                    onClick={savePlan}
                >
                    Uložit plán
                </button>
                <button
                className="mt-6 bg-red-600 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                onClick={deletePlan}
                >
                    Smazat plán
                </button>
            </div>
        </div>
    );
}
