import Application from '@/components/Application'
import { getUser } from '@/lib/users'
import { cookies } from 'next/headers'

export default async function Home() {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value ?? ''

    const user = await getUser(userId)

    return (
        <div className="mx-auto max-w-screen-xl p-2">
            <Application disable={user === null} />
        </div>
    )
}
