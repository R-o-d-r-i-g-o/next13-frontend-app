import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

export const options: NextAuthOptions = {
    providers: [
        // GithubProvider({}),
        CredentialsProvider({
            credentials: {
                email: { label: "E-mail", type: "email", placeholder: "ur email"},
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                const user = { id: '1', name: 'rodrigo', email: 'teste@gmail.com', password: '123' }

                // depois colocar as validações de login [ retornar null quando bloqueado ]

                return user
            }
        })
    ],
    pages: {
        signIn: "/sign-in"
    }
}