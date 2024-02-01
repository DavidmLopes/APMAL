'use client'

import { useEffect, useState } from 'react'
import Scraper, { Anime } from './Scraper'
import { AnimeMAL, AnimeStatusMAL, isSameStatus } from '@/lib/mal'
import Animes from './Animes'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

export default function Application({ available }: { available: boolean }) {
    const { toast } = useToast()

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
        const resp = await fetch('/api/mal/updateAnimes', {
            method: 'PUT',
            credentials: 'include',
            cache: 'no-cache',
            body: JSON.stringify(difAnimes),
        })

        if (resp.status === 403) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Not valid user on MAL',
                duration: 2500,
            })
            return
        }

        if (resp.status !== 200) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Internal Error',
                duration: 2500,
            })
            return
        }

        const notUpdatedAnimes = (await resp.json()) as Array<Anime>
        setDifAnimes(notUpdatedAnimes)

        if (notUpdatedAnimes.length > 0) {
            toast({
                variant: 'alert',
                title: 'Updated partially',
                description: 'Updated your MAL, but not all animes',
                duration: 2500,
            })
            return
        }

        toast({
            title: 'Updated',
            description: 'Updated your MAL',
            duration: 2500,
        })
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
