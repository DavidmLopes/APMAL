type MALNode = {
    node: {
        title: string
        alternative_titles: {
            synonyms: Array<string>
            en: string
        }
        start_season: {
            year: number
            season: string
        }
        num_episodes: number
    }
}

export async function getAnime(
    name: string,
    alternative_titles: string[] = [],
    year: string = '0',
    total_eps: string = '0',
) {
    const { anime, info } = await fetch(
        'https://api.myanimelist.net/v2/anime?q=' +
            name.slice(0, 50) +
            '&limit=20&fields=alternative_titles,start_season,num_episodes',
        {
            method: 'GET',
            headers: {
                'X-MAL-CLIENT-ID': `${process.env.MAL_CLIENT_ID}`,
            },
        },
    )
        .then((res) => {
            // TODO: If 403, maybe something is wrong with the API key

            return res.json()
        })
        .then(async (data) => {
            const animeName = simpleTitle(name)
            const animeAltTitles = alternative_titles.map((title) =>
                simpleTitle(title),
            )

            let anime: MALNode

            anime = data.data.find(
                (element: MALNode) =>
                    simpleTitle(element.node.title) === animeName ||
                    element.node.alternative_titles.synonyms
                        .map((synonym) => simpleTitle(synonym))
                        .includes(animeName) ||
                    simpleTitle(element.node.alternative_titles.en) ===
                        animeName ||
                    animeAltTitles.includes(simpleTitle(element.node.title)) ||
                    animeAltTitles.includes(
                        simpleTitle(element.node.alternative_titles.en),
                    ),
            )

            if (anime) {
                return { anime: anime.node.title, info: 'FOUND' }
            }

            anime = data.data.find(
                (element: MALNode) =>
                    element.node.start_season != undefined &&
                    year != '0' &&
                    element.node.start_season.year === parseInt(year) &&
                    total_eps != '0' &&
                    element.node.num_episodes === parseInt(total_eps),
            )

            if (anime) {
                return {
                    anime: anime.node.title,
                    info: 'FOUND WITH EXTRA PROPS',
                }
            }

            const animeElem = await fetch(
                'https://myanimelist.net/search/prefix.json?type=anime&keyword=' +
                    name +
                    '&v=1',
            )
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    const animeElem: { name: string } =
                        data.categories[0].items.find(
                            (element: { name: string }) =>
                                simpleTitle(element.name) === animeName ||
                                animeAltTitles.includes(
                                    simpleTitle(element.name),
                                ),
                        )

                    return animeElem
                })

            if (animeElem) {
                return {
                    anime: animeElem.name,
                    info: 'FOUND WITHOUT API',
                }
            }

            return { anime: '', info: 'NOT FOUND' }
        })
        .catch((err) => {
            return { anime: '', info: 'ERROR' }
        })

    return { anime, info }
}

function simpleTitle(title: string) {
    return title.replace(': ', ' ').replace(' - ', ' ')
}
