import { getServerSession } from "next-auth"

export default async function Test() {
    const session = await getServerSession()

    return <> fdoisj { session?.user?.email }</>
}