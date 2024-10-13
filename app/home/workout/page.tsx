"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWorkoutPlans, getWorkoutPlanByName, saveWorkoutLog } from "@/lib/firebase";
import { WorkoutPlan, Exercise } from "@/Interfaces/workoutPlan";
import { ExerciseLog, WorkoutLog } from "@/Interfaces/WorkoutLog";
import { useRouter } from "next/navigation";

export default function Workout() {
    const { user } = useAuth();
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSelectedWorkoutPlan, setIsSelectedWorkoutPlan] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [curExerciseIndex, setCurExerciseIndex] = useState(0);
    const [curSet, setCurSet] = useState(1);
    const [repsInputValue, setRepsInputValue] = useState(0);
    const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        const fetchWorkoutPlans = async () => {
            if (user) {
                try {
                    const plans = await getWorkoutPlans(user.uid);
                    setWorkoutPlans(plans);
                } catch (err) {
                    setError("Failed to load workout plans.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchWorkoutPlans();
    }, [user]);

    const handleRepsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRepsInputValue(Number(event.target.value));
    };

    const handleWorkoutPlanSelect = async () => {
        if (selectedPlan) {
            try {
                const plan = await getWorkoutPlanByName(user.uid, selectedPlan);
                setStartTime(Date.now())
                setSelectedWorkoutPlan(plan);
                setIsSelectedWorkoutPlan(true);
                if (plan && plan.exercises.length > 0) {
                    setCurExerciseIndex(0);
                } else {
                    console.error("No exercises found in the selected plan.");
                }
            } catch (err) {
                setError("Failed to fetch the selected workout plan.");
                console.error(err);
            }
        }
    };

    const handleNextSet = async () => {
        if (!selectedWorkoutPlan) {
            return;
        }

        // Get the current exercise
        const currentExercise = selectedWorkoutPlan.exercises[curExerciseIndex];

        // Save the set
        const newSet = { reps: repsInputValue };
        const updatedLogs = [...exerciseLogs];
        const exerciseLogIndex = updatedLogs.findIndex(log => log.name === currentExercise.name);

        if (exerciseLogIndex === -1) {
            // If first set of this exercise
            updatedLogs.push({
                name: currentExercise.name,
                weight: currentExercise.weight,
                sets: [newSet]
            });
        } else {
            // If additional set of this exercise
            updatedLogs[exerciseLogIndex].sets.push(newSet);
        }

        setExerciseLogs(updatedLogs);

        if (curSet < currentExercise.sets) {
            // Move to the next set of the current exercise
            setCurSet(curSet + 1);
        } else {
            // Move to the next exercise
            if (curExerciseIndex < selectedWorkoutPlan.exercises.length - 1) {
                setCurExerciseIndex(curExerciseIndex + 1);
                setCurSet(1); // Reset to the first set of the next exercise
            } else {
                // Workout complete, log results
                setIsSelectedWorkoutPlan(false);
                const workoutLength = new Date(Date.now() - startTime).toISOString().substr(11, 8);
                const workoutLog: WorkoutLog = {
                    muscleGroup: selectedPlan,
                    date: new Date().toISOString(),
                    workoutLength: workoutLength, // Implement a method to calculate
                    exercises: exerciseLogs
                };
                console.log("Workout Log:", workoutLog);

                // Save workout log to Firebase
                if (user) {
                    await saveWorkoutLog(user.uid, workoutLog);
                    router.push("/home");
                    
                } else {
                    console.error("User not authenticated. Unable to save workout log.");
                }
            }
        }
        setRepsInputValue(0)
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold">Zahájení tréninku</h1>
                <p>Načítání...</p>
            </div>
        );
    }

    if (!isSelectedWorkoutPlan) {
        return (
            <>
                <h1 className="text-2xl font-bold">Zahájení tréninku</h1>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <>
                        <select
                            className="mt-4 w-full rounded-xl px-2 py-3 bg-transparent border-none outline-none outline-[#313244]"
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                        >
                            <option value="" className="text-black">Vyberte tréninkový plán</option>
                            {workoutPlans.map((plan, index) => (
                                <option className="text-black" key={index} value={plan.planName}>
                                    {plan.planName}
                                </option>
                            ))}
                        </select>
                        <button
                            className="mt-3 w-full bg-transparent text-green-500 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                            onClick={handleWorkoutPlanSelect}
                        >
                            Zahájit
                        </button>
                    </>
                )}
            </>
        );
    }

    const currentExercise = selectedWorkoutPlan?.exercises[curExerciseIndex];

    return (
        <div className="flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold">Průběh tréninku</h1>
                <div>Vybraný plán: {selectedWorkoutPlan?.planName}</div>
                <div className="w-full mt-32 flex flex-col items-center">
                    <p className="text-center text-xl font-bold">{currentExercise?.name}</p>
                    <p className="text-center ">Série: {curSet}/{currentExercise?.sets}</p>
                    <p className="text-center">Váha: {currentExercise?.weight}Kg</p>
                    <p className="text-center mt-6">Opakování</p>
                    <input
                        type="number"
                        className="w-10 mt-2 bg-transparent outline outline-1 rounded-xl py-2 px-3 outline-[#313244] text-center"
                        value={repsInputValue}
                        onChange={handleRepsInputChange}
                    />
                </div>
            </div>
            <div className="fixed bottom-10 w-[90vw]">
                <button
                    className="w-full bg-transparent text-green-500 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                    onClick={handleNextSet}
                >
                    Další série
                </button>
            </div>
        </div>
    );
}