"use client";

import { useState, useEffect, Suspense } from "react"; // Import Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateWorkoutPlan, getWorkoutPlans, deleteWorkoutPlan } from "@/lib/firebase";
import { WorkoutPlan, Exercise } from "@/Interfaces/workoutPlan";
import { ExerciseItem } from "../ExerciseItem";
import Link from "next/link";
import Image from "next/image"
import arrowBackIcon from "@/icons/i_arrow_back.png"

const EditWorkoutPlanContent = () => {
    const { user } = useAuth();
    const [planName, setPlanName] = useState<string>("");
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPlanName = searchParams.get("planName");
    const [oldPlanName, setOldPlanName] = useState<string>("");

    useEffect(() => {
        if (user && initialPlanName) {
            const fetchPlans = async () => {
                const plans: WorkoutPlan[] = await getWorkoutPlans(user.uid);
                const selectedPlan = plans.find((plan) => plan.planName === initialPlanName);
                if (selectedPlan) {
                    setPlanName(selectedPlan.planName);
                    setExercises(selectedPlan.exercises);
                    setOldPlanName(selectedPlan.planName);
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

        await updateWorkoutPlan(user.uid, oldPlanName, updatedPlan);
        console.log("Workout plan updated.");
        router.push("/plans");
    };

    const deletePlan = async () => {
        if (!user || !planName) return;
        await deleteWorkoutPlan(user.uid, oldPlanName);
        console.log("Workout plan deleted.");
        router.push("/plans");
    };

    return (
        <div>
            <Link href={"/plans"}>
                <div className="flex">
                    <Image alt="" src={arrowBackIcon} className="h-5 w-5 mt-1 mr-1" />
                    <h1 className="text-2xl font-bold">Uravit plán</h1>
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
                    className="mt-4 bg-green-600 rounded-xl py-2 px-3"
                    onClick={savePlan}
                >
                    Uložit plán
                </button>
                <button
                    className="mt-6 bg-red-600 rounded-xl py-2 px-3"
                    onClick={deletePlan}
                >
                    Smazat plán
                </button>
            </div>
        </div>
    );
};

const EditWorkoutPlan = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditWorkoutPlanContent />
        </Suspense>
    );
};

export default EditWorkoutPlan;
