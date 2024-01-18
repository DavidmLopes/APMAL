'use server'

import { AnimeAP, getAnimes as getAnimesAP } from '@/lib/ap'
import { getAnime as getAnimeMal } from '@/lib/mal'
import { Anime } from './Scraper'

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
