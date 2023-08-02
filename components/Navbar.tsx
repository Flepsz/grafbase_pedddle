import Link from "next/link";
import Image from "next/image";
import { NavLinks } from "@/constants";
import AuthProviders from "./AuthProviders";
import { getCurrentUser } from "@/lib/session";
import { signOut } from "next-auth/react"
import ProfileMenu from "./ProfileMenu";

export default async function Navbar() {
    const session = await getCurrentUser();
    return (
        <nav className="flexBetween navbar">
            <div className="flex-1 flexStart gap-10">
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        width={115}
                        height={43}
                        alt="Pedddle"
                    />
                </Link>
                <ul className="xl:flex hidden text-sm gap-7">
                    {NavLinks.map((link) => (
                        <Link href={link.href} key={link.key}>
                            {link.text}
                        </Link>
                    ))}
                </ul>
            </div>
            <div className="flexCenter gap-4">
                {session?.user ? (
                    <>
                        <ProfileMenu session={session} />
                        {/* {session?.user?.image && (
                            <Link href={`/profile/${session?.user?.id}`}>
                                <Image
                                    src={session.user.image}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    alt={session.user.name}
                                />
                            </Link>
                        )} */}

                        <Link href="/create-project">Share Work</Link>

                        <button type="button" className="text-sm" onClick={signOut}></button>
                    </>
                ) : (
                    <AuthProviders />
                )}
            </div>
        </nav>
    );
}
