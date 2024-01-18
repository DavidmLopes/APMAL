import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from './ui/button'

export default function Logout({ className }: { className?: string }) {
    async function logoutAction() {
        'use server'

        cookies().delete('userId')
        redirect('/')
    }

    return (
        <form action={logoutAction}>
            <Button type="submit" className={className}>
                Logout
            </Button>
        </form>
    )
}
