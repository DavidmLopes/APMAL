'use client'

import { useEffect, useState } from 'react'
import Scraper, { Anime } from './Scraper'
import { AnimeMAL, AnimeStatusMAL, isSameStatus } from '@/lib/mal'
import Animes from './Animes'

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
                                userAnime.title === anime.mal?.title &&
                                (anime.ap.status === undefined ||
                                    isSameStatus(
                                        anime.ap.status,
                                        userAnime.status,
                                    )),
                        ) === undefined,
                ),
            )
        }

        if (animes.length === 0) return

        compareAnimes()
    }, [animes])

    return (
        <div>
            <Scraper setAnimes={setAnimes} available={available} />
            {animes.length > 0 && (
                <>
                    <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                        Missing on MAL
                    </h3>
                    <Animes animes={difAnimes} />
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
