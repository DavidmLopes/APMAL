'use server'

import { AnimeAP, getAnimes as getAnimesAP } from '@/lib/ap'
import { AnimeMAL, getAnime as getAnimeMal } from '@/lib/mal'

export type Anime = {
    ap: AnimeAP
    mal: AnimeMAL
}

export async function getAnimes(username: string): Promise<Array<Anime>> {
    const animes = await getAnimesAP(username)

    const animesData = await Promise.all(
        animes.map(async (apAnime: AnimeAP) => {
            const malAnime = await getAnimeMal(
                apAnime.title,
                apAnime.alternative_titles,
                apAnime.year,
                apAnime.total_eps,
            )

            return {
                ap: apAnime,
                mal: malAnime,
            }
        }),
    )

    const notfounds = animesData.filter(
        (anime) => anime.mal.info === 'NOT FOUND',
    )

    const errors = animesData.filter((anime) => anime.mal.info === 'ERROR')

    const extras = animesData.filter(
        (anime) => anime.mal.info === 'FOUND WITH EXTRA PROPS',
    )

    const extras2 = animesData.filter(
        (anime) => anime.mal.info === 'FOUND WITHOUT API',
    )

    console.log('TOTAL: ' + animesData.length)
    console.log('FOUND WITH EXTRA PROPS: ' + extras.length)
    console.log('FOUND WITHOUT API: ' + extras2.length)
    console.log('NOT FOUND: ' + notfounds.length)
    console.log('ERROR: ' + errors.length)

    return animesData
}
