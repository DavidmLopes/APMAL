import Application from '@/components/Application'
import Logout from '@/components/Logout'
import ThemeButton from '@/components/ThemeButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getUser } from '@/lib/users'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value ?? ''

    const user = await getUser(userId)

    return (
        <div>
            <div className="flex w-full items-center justify-between bg-neutral-100 p-2 dark:bg-neutral-800">
                <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
                    APMAL
                </h1>
                <div className="flex items-center space-x-2">
                    {!user ? (
                        <Button asChild>
                            <Link href="/authorize">Login MAL</Link>
                        </Button>
                    ) : (
                        <>
                            <Avatar>
                                <AvatarImage src={user.picture} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <Logout />
                        </>
                    )}
                    <ThemeButton />
                </div>
            </div>
            <div className="mx-auto max-w-screen-xl p-2">
                <Application available={user != null} />
            </div>
        </div>
    )
}
