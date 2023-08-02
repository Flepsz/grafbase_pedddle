import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "../gmbrr/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId:
                "1008476502265-4uaseokt4i83muulfj9m6k25kgivid2q.apps.googleusercontent.com",
            clientSecret: "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",
        }),
    ],
    jwt: {
        encode: ({ secret, token }) => {
            const encodedtoken = jsonwebtoken.sign({
                ...token,
                iss: "grafbase",
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            }, secret);

            return encodedtoken
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;

            return decodedToken
        },
    },
    theme: {
        colorScheme: "light",
        logo: "/logo.svg",
    },
    callbacks: {
        async session({ session }) {
            const email = session?.user?.email as string;
            try {
                const data = (await getUser(email)) as { user?: UserProfile };

                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user,
                    },
                };
                return session;
            } catch (error) {
                console.log("Error retrieving user data", error);
                return session;
            }
        },
        async signIn({ user }: { user: AdapterUser | User }) {
            try {
                const userExists = (await getUser(user?.email as string)) as {
                    user?: UserProfile;
                };
                if (!userExists.user) {
                    await createUser(
                        user.name as string,
                        user.email as string,
                        user.image as string
                    );
                }
                return true;
            } catch (error: any) {
                console.log(error);
                return false;
            }
        },
    },
};

export async function getCurrentUser() {
    const session = (await getServerSession(authOptions)) as SessionInterface;
    return session;
}
