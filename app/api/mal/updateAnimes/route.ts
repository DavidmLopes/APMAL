import { Anime } from '@/components/Scraper'
import { updateAnimeStatus } from '@/lib/mal'
import { getUser } from '@/lib/users'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 5000

export async function PUT(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value
    const animes: Array<Anime> = await request.json()

    if (!userId) {
        return forbiddenResponse()
    }

    const user = await getUser(userId)

    if (!user) {
        return forbiddenResponse()
    }

    const notUpdatedAnimes = await updateAnimeStatus(user.access_token, animes)

    return NextResponse.json(notUpdatedAnimes)
}

function forbiddenResponse() {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
