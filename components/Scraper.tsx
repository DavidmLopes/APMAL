import { getAnime } from '@/lib/mal'
import * as cheerio from 'cheerio'

const AP_URL = 'https://www.anime-planet.com/users/Master15/anime?sort=title'

export default async function Scraper() {
    async function scraperAction() {
        'use server'

        const animes: Array<{
            title: string
            alternative_titles: string[]
            year: string
            total_eps: string
        }> = []

        async function getAnimes(url: string) {
            const html = await fetch(url).then((res) => res.text())

            const $ = cheerio.load(html)

            $('.cardDeck')
                .find('[data-type=anime]')
                .each((i, el) => {
                    const title = $(el).find('h3').text()

                    const info = $(el).find('.tooltip').attr('title')
                    let year = ''
                    const alternative_titles = [] as string[]
                    const total_eps = $(el).attr('data-total-episodes') ?? ''
                    if (info) {
                        const $$ = cheerio.load(info)
                        year = $$('.iconYear').text().substring(0, 4)
                        const alternative_title = $$('h6').text().substring(11)
                        if (alternative_title != '') {
                            if (alternative_title.charAt(0) === ' ') {
                                alternative_title
                                    .split(',')
                                    .forEach((title) => {
                                        alternative_titles.push(
                                            title.substring(1),
                                        )
                                    })
                            } else {
                                alternative_titles.push(alternative_title)
                            }
                        }
                    }

                    animes.push({ title, alternative_titles, year, total_eps })
                })

            if ($('.next a').length > 0) {
                const next = $('.next a').attr('href')
                await getAnimes(AP_URL + next)
            }
        }

        await getAnimes(AP_URL)

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
