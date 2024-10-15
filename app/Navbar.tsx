import { NavbarItems } from '@/Enums/NavbarEnum';
import Link from 'next/link';

interface INavbarProps {
    active: NavbarItems;
}

export default function Navbar({ active }: INavbarProps) {
    return (
        <div className="bg-[#11111b] fixed px-4 pt-4 pb-8 bottom-0 left-0 w-full border-t border-t-[#313244] flex justify-around items-center">
            <Link href="/home">
                <div className={active === NavbarItems.trainings ? 'font-bold' : ''}>Tréninky</div>
            </Link>
            <Link href="/plans">
                <div className={active === NavbarItems.plans ? 'font-bold' : ''}>Plány</div>
            </Link>
            {/* <Link href="/friends">
                <div className={active === NavbarItems.friends ? 'font-bold' : ''}>Přátelé</div>
            </Link>
            <Link href="/profile">
                <div className={active === NavbarItems.profile ? 'font-bold' : ''}>Profil</div>
            </Link> */}
        </div>
    );
}
