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
                    className="bg-highlights hover:bg-highlights-h inline-block rounded-lg px-6 py-2 text-center font-medium"
                >
                    Authorize
                </Link>
            ) : (
                <Logout className="bg-highlights hover:bg-highlights-h inline-block rounded-lg px-6 py-2 text-center font-medium" />
            )}
        </div>
    )
}
