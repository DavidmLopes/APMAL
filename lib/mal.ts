import { AnimeAP, AnimeStatus } from './ap'

type MALNode = {
    node: {
        id: number
        title: string
        alternative_titles: {
            synonyms: Array<string>
            en: string
        }
        media_type: string
        start_season: {
            year: number
            season: string
        }
        num_episodes: number
    }
}

export type AnimeMAL = {
    id: number
    title: string
}

// TODO: Maybe refactor this to use enums
function typeAPtoMAL(apType: string) {
    const types = [] as string[]

    switch (apType) {
        case 'TV':
            types.push('tv')
            break
        case 'Movie':
            types.push('movie')
            break
        case 'OVA':
            types.push('ova', 'ona', 'special')
            break
        case 'Web':
            types.push('ona', 'tv')
            break
        case 'TV Special':
            types.push('tv special', 'special')
            break
        case 'DVD Special':
            types.push('special')
            break
        case 'Music Video':
            types.push('music')
            break
        case 'Other':
            types.push('special', 'ova', 'movie')
            break
    }

    return types
}

export async function getAnime(
    apAnime: AnimeAP,
): Promise<AnimeMAL | undefined> {
    return await fetch(
        'https://api.myanimelist.net/v2/anime?q=' +
            apAnime.title.slice(0, 50) +
            '&limit=20&fields=alternative_titles,start_season,num_episodes,media_type',
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
            const animeName = simpleTitle(apAnime.title)
            const animeAltTitles = apAnime.alternative_titles.map((title) =>
                simpleTitle(title),
            )

            let anime: MALNode

            anime = data.data.find(
                (element: MALNode) =>
                    (simpleTitle(element.node.title) === animeName ||
                        element.node.alternative_titles.synonyms
                            .map((synonym) => simpleTitle(synonym))
                            .includes(animeName) ||
                        simpleTitle(element.node.alternative_titles.en) ===
                            animeName ||
                        animeAltTitles.includes(
                            simpleTitle(element.node.title),
                        ) ||
                        animeAltTitles.includes(
                            simpleTitle(element.node.alternative_titles.en),
                        ) ||
                        animeAltTitles.some((altTitle) =>
                            element.node.alternative_titles.synonyms
                                .map((synonym) => simpleTitle(synonym))
                                .includes(altTitle),
                        )) &&
                    typeAPtoMAL(apAnime.type).includes(
                        element.node.media_type.toLowerCase(),
                    ),
            )

            if (anime) {
                return {
                    id: anime.node.id,
                    title: anime.node.title,
                }
            }

            const animeElem = await fetch(
                'https://myanimelist.net/search/prefix.json?type=anime&fields=alternative_titles&keyword=' +
                    apAnime.title +
                    '&v=1',
            )
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    const animeElem: { id: number; name: string } =
                        data.categories[0].items.find(
                            (element: {
                                id: number
                                name: string
                                payload: {
                                    start_year: number
                                    media_type: string
                                }
                            }) =>
                                (simpleTitle(element.name) === animeName ||
                                    animeAltTitles.includes(
                                        simpleTitle(element.name),
                                    )) &&
                                typeAPtoMAL(apAnime.type).includes(
                                    element.payload.media_type.toLowerCase(),
                                ),
                        )

                    return animeElem
                })

            if (animeElem) {
                return {
                    id: animeElem.id,
                    title: animeElem.name,
                }
            }

            anime = data.data.find(
                (element: MALNode) =>
                    element.node.start_season != undefined &&
                    apAnime.year != '0' &&
                    element.node.start_season.year === parseInt(apAnime.year) &&
                    apAnime.total_eps != '0' &&
                    element.node.num_episodes === parseInt(apAnime.total_eps) &&
                    typeAPtoMAL(apAnime.type).includes(
                        element.node.media_type.toLowerCase(),
                    ),
            )

            if (anime) {
                return {
                    id: anime.node.id,
                    title: anime.node.title,
                }
            }

            return undefined
        })
        .catch((err) => {
            console.log(
                'Error in MAL getting ' + apAnime.title + ' with error ' + err,
            )
            return undefined
        })
}

function simpleTitle(title: string) {
    return title.replace(': ', ' ').replace(' - ', ' ')
}

type MALStatus = {
    list_status: {
        status: string
        num_episodes_watched: number
    }
}

export type AnimeStatusMAL = {
    status: string
    num_episodes_watched: number
}

export async function getUserAnimes(
    access_token: string,
    next: string = '',
): Promise<Array<AnimeMAL & AnimeStatusMAL>> {
    return await fetch(
        next
            ? next
            : 'https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=1000&nsfw=true',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        },
    )
        .then((res) => {
            try {
                return res.json()
            } catch (err) {
                console.log('Error in getUserAnimes with error ' + err)
                return { data: [] }
            }
        })
        .then((data) => {
            if (data.length === 0) {
                return []
            }

            const animes: Array<AnimeMAL & AnimeStatusMAL> = data.data.map(
                (anime: MALNode & MALStatus) => {
                    return {
                        id: anime.node.id,
                        title: anime.node.title,
                        status: anime.list_status.status,
                        num_episodes_watched:
                            anime.list_status.num_episodes_watched,
                    }
                },
            )

            if (data.paging.next) {
                return getUserAnimes(access_token, data.paging.next).then(
                    (animesNextPage) => {
                        animesNextPage.forEach((anime) => {
                            animes.push(anime)
                        })

                        return animes
                    },
                )
            }

            return animes
        })
}

export function isSameStatus(apStatus: AnimeStatus, malStatus: string) {
    switch (apStatus) {
        case AnimeStatus.WATCHING:
            return malStatus === 'watching'
        case AnimeStatus.WATCHED:
            return malStatus === 'completed'
        case AnimeStatus.STALLED:
            return malStatus === 'on_hold'
        case AnimeStatus.DROPPED:
            return malStatus === 'dropped'
        case AnimeStatus.WANT_TO_WATCH:
            return malStatus === 'plan_to_watch'
    }
}
