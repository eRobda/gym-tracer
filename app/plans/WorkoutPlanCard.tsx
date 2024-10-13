import { WorkoutPlan } from "../../Interfaces/workoutPlan";
import Link from 'next/link';

export default function WorkoutPlanCard({planName}: WorkoutPlan){
    return (
        <Link
            href={{
                pathname: "/plans/edit",
                query: { planName: planName }, // Pass the plan name as a query parameter
            }}
            className="outline outline-1 outline-[#313244] py-2 px-3 rounded-xl"
        >
            <h2 className="font-semibold">{planName}</h2>
        </Link>
    )
}