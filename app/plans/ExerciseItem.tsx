"use client";

interface ExerciseItemProps {
    index: number;
    exercise: { name: string; sets: number; reps: number; weight: number };
    onDelete: () => void;
    onUpdate: (updatedExercise: { name: string; sets: number; reps: number; weight: number }) => void;
}

export function ExerciseItem({ index, exercise, onDelete, onUpdate }: ExerciseItemProps) {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...exercise, name: e.target.value });
    };

    const handleSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...exercise, sets: parseInt(e.target.value) });
    };

    const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...exercise, reps: parseInt(e.target.value) });
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...exercise, weight: parseInt(e.target.value) });
    };

    return (
        <div className="flex flex-col gap-2 mt-2">
            <p>Cvik {index + 1}</p>
            <p>Název cviku</p>
            <input
                className="bg-transparent outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                type="text"
                value={exercise.name}
                onChange={handleNameChange}
            />
            <p>Počet serií</p>
            <input
                className="bg-transparent outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                type="number"
                value={exercise.sets}
                onChange={handleSetsChange}
            />
            <p>Počet opakování</p>
            <input
                className="bg-transparent outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                type="number"
                value={exercise.reps}
                onChange={handleRepsChange}
            />
            <p>Váha - Kg</p>
            <input
                className="bg-transparent outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                type="number"
                value={exercise.weight}
                onChange={handleWeightChange}
            />

            <button
                className="mt-2 bg-transparent text-red-500 outline outline-1 rounded-xl py-2 px-3 outline-[#313244]"
                onClick={onDelete}
            >
                Smazat cvik
            </button>
        </div>
    );
}
