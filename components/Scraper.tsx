import { getAnimes } from '@/lib/ap'
import { getAnime } from '@/lib/mal'
import { Input } from './ui/input'
import { Button } from './ui/button'

export default async function Scraper() {
    async function scraperAction(data: FormData) {
        'use server'

        const username = data.get('username')
        if (!username || typeof username !== 'string') return

        const animes = await getAnimes(username)

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
        <form
            action={scraperAction}
            className="flex w-full items-center space-x-2"
        >
            <Input type="text" name="username" />
            <Button type="submit">Search</Button>
        </form>
    )
}
