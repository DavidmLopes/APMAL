'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { getAnimes, getAnimesMal } from './actions'
import { AnimeAP } from '@/lib/ap'
import { AnimeMAL, isSameStatus } from '@/lib/mal'
import { useState } from 'react'

export type Anime = {
    ap: AnimeAP
    mal: AnimeMAL | undefined
}

export default function Scraper({
    setAnimes,
    setDifAnimes,
    available,
}: {
    setAnimes: (animes: Array<Anime>) => void
    setDifAnimes: (animes: Array<Anime>) => void
    available: boolean
}) {
    const [loading, setLoading] = useState<boolean>(false)

    async function scraperAction(data: FormData) {
        const username = data.get('username')
        if (!username || typeof username !== 'string') return

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }

        const animes = await getAnimes(username)

        const userAnimes = await getAnimesMal()
        if (userAnimes === undefined) {
            // TODO: Notify user that have no permission to access MAL
        } else {
            setDifAnimes(
                animes.filter(
                    (anime) =>
                        anime.mal != undefined &&
                        anime.ap.status != undefined &&
                        userAnimes.find(
                            (userAnime) =>
                                userAnime.id === anime.mal?.id &&
                                isSameStatus(
                                    anime.ap.status,
                                    userAnime.status,
                                ) &&
                                (anime.ap.eps_watched === '' ||
                                    Number(anime.ap.eps_watched) ===
                                        userAnime.num_episodes_watched),
                        ) === undefined,
                ),
            )
        }

        setLoading(false)
        setAnimes(animes)
    }

    return (
        <div>
            <form
                action={scraperAction}
                className="flex w-full items-center space-x-2"
                onSubmit={() => {
                    setAnimes([])
                    setLoading(true)
                }}
            >
                <Input
                    type="text"
                    name="username"
                    placeholder="AnimePlanet Username"
                    disabled={!available || loading}
                />
                <Button type="submit" disabled={!available || loading}>
                    Search
                </Button>
            </form>
            {loading && (
                <div className="my-6 w-full text-center">
                    <span className="box-border inline-block h-12 w-12 animate-spin rounded-[50%] border-[5px] border-black border-b-transparent dark:border-white dark:border-b-transparent"></span>
                </div>
            )}
        </div>
    )
}
