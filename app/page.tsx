import Link from 'next/link'
import { cookies } from 'next/headers'
import Logout from '@/components/Logout'

export default function Home() {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('access_token')?.value ?? ''

    return (
        <div>
            {accessToken === '' ? (
                <Link
                    href={'/authorize'}
                    className="inline-block rounded-lg bg-highlights px-6 py-2 text-center font-medium hover:bg-highlights-h"
                >
                    Login with MAL
                </Link>
            ) : (
                <Logout className="inline-block rounded-lg bg-highlights px-6 py-2 text-center font-medium hover:bg-highlights-h" />
            )}
        </div>
    )
}
