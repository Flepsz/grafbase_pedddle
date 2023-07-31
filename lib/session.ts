import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "../gmbrr/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { SessionInterface } from "@/common.types";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId:
                "1008476502265-4uaseokt4i83muulfj9m6k25kgivid2q.apps.googleusercontent.com",
            clientSecret: "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",
        }),
    ],
    // jwt: {
    //     encode: ({ secret, token }) => {

    //     },
    //     decode: async ({ secret, token }) => {

    //     }
    // },
    theme: {
        colorScheme: "light",
        logo: "/logo.svg",
    },
    callbacks: {
        async session({ session }) {
            return session;
        },
        async signIn({ user }: { user: AdapterUser | User }) {
            try {
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
