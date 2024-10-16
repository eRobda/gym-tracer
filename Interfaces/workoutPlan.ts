export interface WorkoutPlan {
    planName: string;
    exercises: Exercise[];
}

export interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight: number;
}
