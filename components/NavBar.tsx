import Link from 'next/link'
import { Button } from '@components//ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@components//ui/avatar'
import Logout from '@components//Logout'
import ThemeButton from '@components//ThemeButton'
import { getUser } from '@/lib/users'
import { cookies } from 'next/headers'

export default async function NavBar() {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value ?? ''

    const user = await getUser(userId)

    return (
        <div className="flex w-full items-center justify-between bg-neutral-100 p-2 dark:bg-neutral-800">
            <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
                <Link href="/">APMAL</Link>
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
    )
}
