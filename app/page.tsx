import Link from 'next/link'
import { cookies } from 'next/headers'
import Logout from '@/components/Logout'
import { getUser } from '@/lib/users'
import Scraper from '@/components/Scraper'

export default async function Home() {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value ?? ''

    const user = await getUser(userId)

    return (
        <div>
            {userId === '' ? (
                <Link
                    href={'/authorize'}
                    className="inline-block rounded-lg bg-highlights px-6 py-2 text-center font-medium hover:bg-highlights-h"
                >
                    Login with MAL
                </Link>
            ) : (
                <Logout className="inline-block rounded-lg bg-highlights px-6 py-2 text-center font-medium hover:bg-highlights-h" />
            )}
            <Scraper />
        </div>
    )
}
