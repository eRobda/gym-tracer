import { NavbarItems } from "@/Enums/NavbarEnum";
import Navbar from "../Navbar";

export default function Firends(){
    return(
        <div>
            <h1 className="text-2xl font-bold">Tvoji přátelé</h1>
            <Navbar active={NavbarItems.friends}/>
        </div>
    )
}