import * as cheerio from 'cheerio'

export async function getAnimes(apUsername: string, next: string = '') {
    const animes: Array<{
        title: string
        alternative_titles: string[]
        year: string
        total_eps: string
    }> = []

    const html = await fetch(
        'https://www.anime-planet.com/users/' +
            apUsername +
            '/anime?sort=title' +
            next,
    ).then((res) => res.text())

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
                        alternative_title.split(',').forEach((title) => {
                            alternative_titles.push(title.substring(1))
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
        const animesNextPage = await getAnimes(apUsername, next)
        animesNextPage.forEach((anime) => {
            animes.push(anime)
        })
    }

    return animes
}
