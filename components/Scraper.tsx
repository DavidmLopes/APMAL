import { getAnimes } from '@/lib/ap'
import { getAnime } from '@/lib/mal'

export default async function Scraper() {
    async function scraperAction() {
        'use server'

        const animes = await getAnimes('Master15')

        const animesData = await Promise.all(
            animes.map(
                async ({ title, alternative_titles, year, total_eps }) => {
                    const anime = await getAnime(
                        title,
                        alternative_titles,
                        year,
                        total_eps,
                    )

                    return { ap: title, mal: anime }
                },
            ),
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
    }

    return (
        <form action={scraperAction}>
            <button type="submit">Scraper</button>
        </form>
    )
}
