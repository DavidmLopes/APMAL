import { AnimeAP, AnimeStatus } from './ap'
import { createAnime, getAnimeByAP, getAnimeByMAL } from './anime'
import { Anime } from '@/components/Scraper'

type MALAnimeDetails = {
    id: number
    title: string
    alternative_titles: {
        synonyms: Array<string>
        en: string
    }
    status: string
    media_type: string
    start_season: {
        year: number
        season: string
    }
    num_episodes: number
    main_picture: {
        medium: string
    }
}

type MALNode = {
    node: MALAnimeDetails
}

export type AnimeMAL = {
    id: number
    title: string
    image: string
    status: string
    num_episodes_watched: number
}

export type SimpleAnimeMAL = {
    id: number
    title: string
    image: string
}

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

async function getAnimeInfo(id: number): Promise<MALAnimeDetails> {
    return await fetch('https://api.myanimelist.net/v2/anime/' + id, {
        method: 'GET',
        headers: {
            'X-MAL-CLIENT-ID': `${process.env.MAL_CLIENT_ID}`,
        },
    }).then((res) => {
        return res.json()
    })
}

async function getAnimesByTitle(title: string): Promise<Array<MALNode>> {
    return await fetch(
        'https://api.myanimelist.net/v2/anime?q=' +
            title.slice(0, 50) +
            '&limit=20&fields=alternative_titles,start_season,num_episodes,media_type,status',
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
        .then((data) => {
            return data.data
        })
}

function checkForMatch(animeAP: AnimeAP, animes: Array<MALNode>) {
    const apName = simpleTitle(animeAP.title)
    const apAltTitles = animeAP.alternative_titles.map((title) =>
        simpleTitle(title),
    )

    const onlyTitle = animes.find(
        ({ node }: MALNode) =>
            simpleTitle(node.title) === apName &&
            typeAPtoMAL(animeAP.type).includes(node.media_type.toLowerCase()) &&
            (node.status === 'currently_airing' ||
                animeAP.total_eps === node.num_episodes.toString()),
    )

    if (onlyTitle) {
        return onlyTitle
    }

    return animes.find(
        ({ node }: MALNode) =>
            (simpleTitle(node.title) === apName ||
                node.alternative_titles.synonyms
                    .map((synonym) => simpleTitle(synonym))
                    .includes(apName) ||
                simpleTitle(node.alternative_titles.en) === apName ||
                apAltTitles.includes(simpleTitle(node.title)) ||
                apAltTitles.includes(simpleTitle(node.alternative_titles.en)) ||
                apAltTitles.some((altTitle) =>
                    node.alternative_titles.synonyms
                        .map((synonym) => simpleTitle(synonym))
                        .includes(altTitle),
                )) &&
            typeAPtoMAL(animeAP.type).includes(node.media_type.toLowerCase()) &&
            (node.status === 'currently_airing' ||
                animeAP.total_eps === node.num_episodes.toString()),
    )
}

export async function getAnimeMAL(
    animeAP: AnimeAP,
): Promise<SimpleAnimeMAL | undefined> {
    const animeDb = await getAnimeByAP(animeAP.id)

    if (animeDb) {
        const anime = await getAnimeInfo(animeDb.malId)
        if (anime.main_picture === undefined) {
            return undefined
        }
        return {
            id: animeDb.malId,
            title: anime.title,
            image: anime.main_picture.medium,
        }
    }

    const foundAnime: SimpleAnimeMAL | undefined = await getAnimesByTitle(
        animeAP.title,
    )
        .then((animes) => {
            const fAnime = checkForMatch(animeAP, animes)
            if (fAnime) {
                return {
                    id: fAnime.node.id,
                    title: fAnime.node.title,
                    image: fAnime.node.main_picture.medium,
                }
            }
            return undefined
        })
        .catch((err) => {
            console.log(
                'Error in MAL getting ' + animeAP.title + ' with error ' + err,
            )
            return undefined
        })

    if (foundAnime) {
        const animeDb = await getAnimeByMAL(foundAnime.id)
        if (!animeDb) {
            await createAnime(animeAP.id, animeAP.title, foundAnime.id)
        } else {
            console.log('Error creating anime in db ' + animeAP.title)
            console.log(
                'Anime already in db: id=' +
                    animeDb.id +
                    ' mal=' +
                    animeDb.malId,
            )
        }

        return {
            id: foundAnime.id,
            title: foundAnime.title,
            image: foundAnime.image,
        }
    }

    return undefined
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

export async function getUserAnimes(
    access_token: string,
    next: string = '',
): Promise<Array<AnimeMAL>> {
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

            const animes: Array<AnimeMAL> = data.data.map(
                (anime: MALNode & MALStatus) => {
                    return {
                        id: anime.node.id,
                        title: anime.node.title,
                        image: anime.node.main_picture.medium,
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

enum AnimeStatusValueMAL {
    WATCHING = 'watching',
    COMPLETED = 'completed',
    ON_HOLD = 'on_hold',
    DROPPED = 'dropped',
    PLAN_TO_WATCH = 'plan_to_watch',
}

export function isSameStatus(apStatus: AnimeStatus, malStatus: string) {
    switch (apStatus) {
        case AnimeStatus.WATCHING:
            return malStatus === AnimeStatusValueMAL.WATCHING
        case AnimeStatus.WATCHED:
            return malStatus === AnimeStatusValueMAL.COMPLETED
        case AnimeStatus.STALLED:
            return malStatus === AnimeStatusValueMAL.ON_HOLD
        case AnimeStatus.DROPPED:
            return malStatus === AnimeStatusValueMAL.DROPPED
        case AnimeStatus.WANT_TO_WATCH:
            return malStatus === AnimeStatusValueMAL.PLAN_TO_WATCH
    }
}

export function toStatusMAL(apStatus: AnimeStatus) {
    switch (apStatus) {
        case AnimeStatus.WATCHING:
            return AnimeStatusValueMAL.WATCHING
        case AnimeStatus.WATCHED:
            return AnimeStatusValueMAL.COMPLETED
        case AnimeStatus.STALLED:
            return AnimeStatusValueMAL.ON_HOLD
        case AnimeStatus.DROPPED:
            return AnimeStatusValueMAL.DROPPED
        case AnimeStatus.WANT_TO_WATCH:
            return AnimeStatusValueMAL.PLAN_TO_WATCH
    }
}

export async function updateAnimeStatus(
    access_token: string,
    animes: Array<Anime>,
): Promise<Array<Anime>> {
    const promises = animes.map((anime) => {
        if (anime.mal === undefined) {
            return anime
        }

        const statusChanges = new URLSearchParams({
            status: toStatusMAL(anime.ap.status),
        })

        if (anime.ap.status === AnimeStatus.WATCHED) {
            statusChanges.append('num_watched_episodes', '9999')
        }

        if (anime.ap.status != AnimeStatus.WANT_TO_WATCH) {
            statusChanges.append(
                'num_watched_episodes',
                anime.ap.eps_watched.toString(),
            )
        }

        return fetch(
            'https://api.myanimelist.net/v2/anime/' +
                anime.mal.id +
                '/my_list_status',
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: statusChanges,
            },
        )
            .then((res) => {
                if (res.status === 200) {
                    return null
                }
                return anime
            })
            .catch((err) => {
                console.log(
                    'Error in updateAnimeStatus with error ' + err + ' and ',
                    anime,
                )
                return anime
            })
    })

    return await Promise.all(promises).then((results) => {
        return results.filter((result) => result != null) as Array<Anime>
    })
}

export async function updateAnimeStatusV2(
    access_token: string,
    malId: number,
    newStatus: AnimeStatus,
    epsWatched?: number,
): Promise<boolean> {
    const statusChanges = new URLSearchParams({
        status: toStatusMAL(newStatus),
    })

    if (newStatus === AnimeStatus.WATCHED) {
        statusChanges.append('num_watched_episodes', '9999')
    }

    if (newStatus != AnimeStatus.WANT_TO_WATCH) {
        if (!epsWatched) {
            return false
        }
        statusChanges.append('num_watched_episodes', epsWatched.toString())
    }

    return await fetch(
        'https://api.myanimelist.net/v2/anime/' + malId + '/my_list_status',
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: statusChanges,
        },
    )
        .then((res) => {
            if (res.status === 200) {
                return true
            }
            return false
        })
        .catch((err) => {
            console.log(
                'Error in updateAnimeStatus with error ' +
                    err +
                    ' and MalID' +
                    malId,
            )
            return false
        })
}
