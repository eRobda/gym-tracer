export interface Set {
    reps: number;
}

export interface ExerciseLog {
    name: string;
    weight: number;
    sets: Set[];
}

export interface WorkoutLog {
    date: string;
    muscleGroup: string;
    workoutLength: string;
    exercises: ExerciseLog[];
}
