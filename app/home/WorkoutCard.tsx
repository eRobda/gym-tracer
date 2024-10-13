interface IWorkoutCardProps{
    muscleGroup: string;
    trainingLenght: string;
    date: string;
}

export default function WorkoutCard({muscleGroup, trainingLenght, date}: IWorkoutCardProps){
    return (
        <div className="outline outline-1 outline-[#313244] py-2 px-3 rounded-xl">
            <h2 className="text-lg font-semibold">{muscleGroup}</h2>
            <p>Délka tréniku: {trainingLenght}</p>
            <p>Datum: {date}</p>
        </div>
    )
}