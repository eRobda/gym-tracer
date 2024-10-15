"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveWorkoutPlan } from "@/lib/firebase"; // Import saveWorkoutPlan
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { WorkoutPlan, Exercise } from "@/Interfaces/workoutPlan"; // Import interfaces
import { ExerciseItem } from "../ExerciseItem";
import arrowBackIcon from "@/icons/i_arrow_back.png";
import Link from "next/link";

export default function AddWorkoutPlan() {
    const { user } = useAuth();
    const [planName, setPlanName] = useState<string>("");
    const [exercises, setExercises] = useState<Exercise[]>([]); // Use the Exercise interface
    const router = useRouter(); // Initialize the router

    const addExercise = () => {
        setExercises((prevExercises) => [
            ...prevExercises,
            { name: "", sets: 0, reps: 0, weight: 0 },
        ]);
    };

    const updateExercise = (index: number, updatedExercise: Exercise) => { // Use the Exercise interface
        setExercises((prevExercises) =>
            prevExercises.map((exercise, i) => (i === index ? updatedExercise : exercise))
        );
    };

    const deleteExercise = (indexToDelete: number) => {
        setExercises((prevExercises) =>
            prevExercises.filter((_, index) => index !== indexToDelete)
        );
    };

    const savePlan = async () => {
        if (!user || !planName) return;

        const workoutPlan: WorkoutPlan = {
            planName,
            exercises,
        };

        await saveWorkoutPlan(user.uid, workoutPlan); // Save workout plan as a full object
        console.log("Workout plan saved.");
        router.push("/plans"); // Redirect to /plans after saving the plan
    };

    return (
        <div>
            <Link href={"/home"}>
                    <div className="flex">
                        <Image alt="" src={arrowBackIcon} className="h-5 w-5 mt-1 mr-1" />
                        <h1 className="text-2xl font-bold">Vytvoř si svůj plán</h1>
                    </div>
                </Link>

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
                            onDelete={() => deleteExercise(index)}
                            onUpdate={(updatedExercise) => updateExercise(index, updatedExercise)}
                        />
                    ))}
                </div>

                <div className="w-full h-[1px] bg-[#313244] mt-4"></div>

                <button
                    className="mt-4 bg-green-600 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                    onClick={addExercise}
                >
                    Přidat cvik
                </button>

                <button
                    className="mt-4 bg-blue-600 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                    onClick={savePlan} // Save workout plan
                >
                    Uložit plán
                </button>
            </div>
        </div>
    );
}
