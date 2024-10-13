"use client"

import { useAuth } from "@/context/AuthContext";
import Navbar from "../Navbar";
import { NavbarItems } from "@/Enums/NavbarEnum";

export default function Profile() {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>; // or redirect, show a login button, etc.
    }
    console.log(user);
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-5 w-full">
                <img className="rounded-full" src={user.photoURL}></img>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{user.displayName}</h1>
                    <div className="flex gap-2">
                        <p className="text-orange-400">Admin</p>
                        <p>VIP</p>
                    </div>
                    <p>Level 49</p>
                </div>
            </div>
            <div className="w-full my-5 h-[1px] bg-[#313244]"></div>
            <div className="flex justify-evenly w-full">
                <div className="flex flex-col items-center">
                    <p className="font-bold">Squat</p>
                    <p>80 kg</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Bench Press</p>
                    <p>68 kg</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Deadlift</p>
                    <p>110 kg</p>
                </div>
            </div>
            <Navbar active={NavbarItems.profile}/>
        </div>
    )
}