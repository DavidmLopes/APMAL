'use client'

import { useEffect, useState } from 'react'
import Scraper, { Anime } from './Scraper'
import { AnimeMAL, AnimeStatusMAL, isSameStatus } from '@/lib/mal'
import Animes from './Animes'
import { Button } from './ui/button'

export default function Application({ available }: { available: boolean }) {
    const [animes, setAnimes] = useState<Array<Anime>>([])

    const [difAnimes, setDifAnimes] = useState<Array<Anime>>([])

    useEffect(() => {
        async function compareAnimes() {
            const userAnimes: Array<AnimeMAL & AnimeStatusMAL> = await fetch(
                '/api/mal/getAnimes',
                {
                    method: 'GET',
                    credentials: 'include',
                    cache: 'no-cache',
                },
            ).then((res) => res.json())

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

        if (animes.length === 0) {
            setDifAnimes([])
            return
        }

        compareAnimes()
    }, [animes])

    async function updateAnimes() {
        const done = await fetch('/api/mal/updateAnimes', {
            method: 'PUT',
            credentials: 'include',
            cache: 'no-cache',
            body: JSON.stringify(difAnimes),
        }).then((res) => res.json())

        setDifAnimes([])

        console.log('Done: ' + done)
        // TODO: Show user if all got right
    }

    return (
        <div>
            <Scraper setAnimes={setAnimes} available={available} />
            {animes.length > 0 && (
                <>
                    {difAnimes.length > 0 && (
                        <>
                            <div className="flex items-center">
                                <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                                    Missing on MAL
                                </h3>
                                <Button className="" onClick={updateAnimes}>
                                    Update MAL
                                </Button>
                            </div>
                            <Animes animes={difAnimes} />
                        </>
                    )}
                    <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                        NotFound
                    </h3>
                    <Animes
                        animes={animes.filter(
                            (anime) => anime.mal === undefined,
                        )}
                    />
                </>
            )}
        </div>
    )
}
