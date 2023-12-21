import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Logout({ className }: { className?: string }) {
    async function logoutAction() {
        'use server'

        cookies().delete('access_token')
        redirect('/')
    }

    return (
        <form action={logoutAction}>
            <button type="submit" className={className}>
                Logout
            </button>
        </form>
    )
}
