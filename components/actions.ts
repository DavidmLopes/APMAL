'use server'

import { AnimeAP, getAnimes as getAnimesAP } from '@/lib/ap'
import {
    getAnime as getAnimeMal,
    getUserAnimes,
    updateAnimeStatus,
} from '@/lib/mal'
import { Anime } from './Scraper'
import { cookies } from 'next/headers'
import { getUser } from '@/lib/users'

export async function getAnimes(username: string): Promise<Array<Anime>> {
    const animes = await getAnimesAP(username)

    const animesData = await Promise.all(
        animes.map(async (apAnime: AnimeAP) => {
            const malAnime = await getAnimeMal(apAnime)

            return {
                ap: apAnime,
                mal: malAnime,
            }
        }),
    )

    const notfounds = animesData.filter((anime) => anime.mal === undefined)

    console.log('TOTAL: ' + animesData.length)
    console.log('NOT FOUND: ' + notfounds.length)

    return animesData
}

export async function getAnimesMal() {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        return undefined
    }

    const user = await getUser(userId)

    if (!user) {
        return undefined
    }

    const animes = await getUserAnimes(user.access_token)

    return animes
}

export async function updateAnimesMAL(animes: Array<Anime>) {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        return undefined
    }

    const user = await getUser(userId)

    if (!user) {
        return undefined
    }

    const notUpdatedAnimes = await updateAnimeStatus(user.access_token, animes)

    return notUpdatedAnimes
}
