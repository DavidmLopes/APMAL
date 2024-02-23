'use server'

import { AnimeAP, getAnimes as getAnimesAP } from '@/lib/ap'
import { getAnimeMAL, getUserAnimes, updateAnimeStatusV2 } from '@/lib/mal'
import { getUser } from '@/lib/users'
import { cookies } from 'next/headers'
import { AnimeAPMAL, AnimeAPMALInfo } from './types'

export async function getUserAnimesAP(
    username: string,
): Promise<Array<AnimeAP>> {
    const animes = await getAnimesAP(username)
    return animes
}

export async function mapAPtoMAL(
    apAnimes: Array<AnimeAP>,
): Promise<Array<AnimeAPMAL>> {
    const animesData = await Promise.all(
        apAnimes.map(async (apAnime: AnimeAP) => {
            const malAnime = await getAnimeMAL(apAnime)

            return {
                ap: apAnime,
                mal: malAnime,
                info:
                    malAnime === undefined
                        ? AnimeAPMALInfo.NOT_FOUND
                        : AnimeAPMALInfo.FOUND,
            }
        }),
    )

    // Can be removed, just for debug
    const notfounds = animesData.filter((anime) => anime.mal === undefined)
    console.log('TOTAL: ' + animesData.length)
    console.log('NOT FOUND: ' + notfounds.length)
    // Can be removed, just for debug

    return animesData
}

export async function getUserAnimesMAL() {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        throw new Error('Not logged in')
    }

    const user = await getUser(userId)

    if (!user) {
        throw new Error('User not found')
    }

    const animes = await getUserAnimes(user.access_token)

    return animes
}

export async function updateAnimesMAL(animes: Array<AnimeAPMAL>) {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        return undefined
    }

    const user = await getUser(userId)

    if (!user) {
        return undefined
    }

    const notUpdatedAnimes = [] as Array<AnimeAPMAL>

    animes.forEach(async (anime) => {
        if (anime.mal === undefined) {
            notUpdatedAnimes.push(anime)
            return
        }

        const updatedAnime = await updateAnimeStatusV2(
            user.access_token,
            anime.mal.id,
            anime.ap.status,
            Number(anime.ap.eps_watched),
        )

        if (!updatedAnime) {
            notUpdatedAnimes.push(anime)
        }
    })

    return notUpdatedAnimes
}
