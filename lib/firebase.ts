// firebase.ts
import { WorkoutLog } from "@/Interfaces/WorkoutLog";
import { WorkoutPlan } from "@/Interfaces/workoutPlan";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzHBD4nZHuEHpNML7YCl4qO6EHw7YYpSM",
    authDomain: "gym-tracer.firebaseapp.com",
    projectId: "gym-tracer",
    storageBucket: "gym-tracer.appspot.com",
    messagingSenderId: "906210009706",
    appId: "1:906210009706:web:e83fa79a98982757b9e013"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Function to check if user collection exists, and create it if not
export const checkAndCreateUserCollection = async (user: User) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid); // Reference to the user document
    const docSnapshot = await getDoc(userRef);

    if (!docSnapshot.exists()) {
        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
        });
        console.log("User collection created.");
    } else {
        console.log("User collection already exists.");
    }
};

// Function to save workout plan under workout_plans/uid/plan_name
export const saveWorkoutPlan = async (uid: string, workoutPlan: WorkoutPlan) => {
    try {
        const workoutPlansRef = doc(db, "workout_plans", uid); // Reference to user's workout plans document

        const docSnapshot = await getDoc(workoutPlansRef);

        if (!docSnapshot.exists()) {
            // If document doesn't exist, create it with the first workout plan
            await setDoc(workoutPlansRef, {
                plans: [workoutPlan], // Initialize with new workout plan
            });
            console.log("Workout plans document created and plan added.");
        } else {
            // If document exists, update it by adding the new plan to the array
            await updateDoc(workoutPlansRef, {
                plans: arrayUnion(workoutPlan), // Add new plan to existing array
            });
            console.log("New workout plan added.");
        }
    } catch (error) {
        console.error("Error saving workout plan: ", error);
    }
};

export const getWorkoutPlans = async (uid: string) => {
    try {
        const workoutPlansRef = doc(db, "workout_plans", uid); // Reference to user's workout plans document
        const docSnapshot = await getDoc(workoutPlansRef);

        if (docSnapshot.exists()) {
            return docSnapshot.data().plans; // Return the plans array
        } else {
            console.log("No workout plans found.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching workout plans: ", error);
        return [];
    }
};

// New function for deleting a workout plan
// Assuming the WorkoutPlan has a property called 'name'
export const deleteWorkoutPlan = async (uid: string, planName: string) => {
    try {
        const workoutPlansRef = doc(db, "workout_plans", uid); // Reference to user's workout plans document
        const docSnapshot = await getDoc(workoutPlansRef);

        if (docSnapshot.exists()) {
            const plans: WorkoutPlan[] = docSnapshot.data().plans; // Get the existing plans
            const planToDelete = plans.find(plan => plan.planName === planName); // Find the plan to delete

            if (planToDelete) {
                await updateDoc(workoutPlansRef, {
                    plans: arrayRemove(planToDelete), // Remove the found plan
                });
                console.log(`Workout plan "${planName}" deleted successfully.`);
            } else {
                console.log(`Workout plan "${planName}" not found.`);
            }
        } else {
            console.log("No workout plans found.");
        }
    } catch (error) {
        console.error("Error deleting workout plan: ", error);
    }
};


// Updated function for updating a workout plan
export const updateWorkoutPlan = async (uid: string, oldPlanName: string, updatedPlan: WorkoutPlan) => {
    try {
        const workoutPlansRef = doc(db, "workout_plans", uid); // Reference to user's workout plans document
        console.log(updatedPlan)
        // Delete the old plan
        await deleteWorkoutPlan(uid, oldPlanName);

        // Add the updated plan
        await updateDoc(workoutPlansRef, {
            plans: arrayUnion(updatedPlan), // Add the updated plan to the existing array
        });
        console.log("Workout plan updated successfully.");
    } catch (error) {
        console.error("Error updating workout plan: ", error);
    }
};

export const getWorkoutPlanByName = async (uid: string, planName: string) => {
    try {
        const workoutPlansRef = doc(db, "workout_plans", uid);
        const docSnapshot = await getDoc(workoutPlansRef);

        if (docSnapshot.exists()) {
            const plans: WorkoutPlan[] = docSnapshot.data().plans; // Get the existing plans
            const selectedPlan = plans.find(plan => plan.planName === planName); // Find the plan by name

            if (selectedPlan) {
                return selectedPlan; // Return the selected plan
            } else {
                console.log(`Workout plan "${planName}" not found.`);
                return null; // Plan not found
            }
        } else {
            console.log("No workout plans found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching workout plan: ", error);
        return null; // Return null on error
    }
};

// Function to save workout log under workout_history/uid
export const saveWorkoutLog = async (uid: string, workoutLog: WorkoutLog) => {
    try {
        const workoutHistoryRef = doc(db, "workout_history", uid); // Reference to user's workout history document

        const docSnapshot = await getDoc(workoutHistoryRef);

        if (!docSnapshot.exists()) {
            // If document doesn't exist, create it with the first workout log
            await setDoc(workoutHistoryRef, {
                logs: [workoutLog], // Initialize with new workout log
            });
            console.log("Workout history document created and log added.");
        } else {
            // If document exists, update it by adding the new log to the array
            await updateDoc(workoutHistoryRef, {
                logs: arrayUnion(workoutLog), // Add new log to existing array
            });
            console.log("New workout log added.");
        }
    } catch (error) {
        console.error("Error saving workout log: ", error);
    }
};

// Function to fetch all workout history
export const getWorkoutHistory = async (uid: string) => {
    try {
        const workoutHistoryRef = doc(db, "workout_history", uid);
        const docSnapshot = await getDoc(workoutHistoryRef);

        if (docSnapshot.exists()) {
            return docSnapshot.data().logs; // Return the workouts array
        } else {
            console.log("No workout history found.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching workout history: ", error);
        return [];
    }
};

