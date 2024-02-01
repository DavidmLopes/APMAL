import { getUserAnimes } from '@/lib/mal'
import { getUser } from '@/lib/users'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 5000

export async function GET(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value

    if (!userId) {
        return forbiddenResponse()
    }

    const user = await getUser(userId)

    if (!user) {
        return forbiddenResponse()
    }

    const animes = await getUserAnimes(user.access_token)

    return NextResponse.json(animes)
}

function forbiddenResponse() {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
