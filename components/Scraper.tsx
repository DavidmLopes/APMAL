import { getAnime } from '@/lib/mal'
import * as cheerio from 'cheerio'

const AP_URL =
    'https://www.anime-planet.com/users/Master15/anime?sort=title&mylist_view=grid&per_page=560'

export default async function Scraper() {
    async function scraperAction() {
        'use server'

        const animes: string[] = []

        async function getAnimes(url: string) {
            const html = await fetch(url).then((res) => res.text())

            const $ = cheerio.load(html)

            $('.cardDeck')
                .find('[data-type=anime]')
                .each((i, el) => {
                    const title = $(el).find('h3').text()

                    animes.push(title)
                })

            if ($('.next a').length > 0) {
                const next = $('.next a').attr('href')
                await getAnimes(AP_URL + next)
            }
        }

        await getAnimes(AP_URL)

        const animesData = await Promise.all(
            animes.map(async (title) => {
                const anime = await getAnime(title)

                return { ap: title, mal: anime }
            }),
        )

        const notfounds = animesData.filter(
            (anime) => anime.mal === 'NOT FOUND' || anime.mal === 'ERROR',
        )

        console.log(animesData.length)
        console.log(notfounds.length)
    }

    return (
        <form action={scraperAction}>
            <button type="submit">Scraper</button>
        </form>
    )
}
