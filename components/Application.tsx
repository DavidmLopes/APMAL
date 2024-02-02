'use client'

import { useState } from 'react'
import Scraper, { Anime } from './Scraper'
import Animes from './Animes'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { updateAnimesMAL } from './actions'

export default function Application({ available }: { available: boolean }) {
    const { toast } = useToast()

    const [animes, setAnimes] = useState<Array<Anime>>([])

    const [difAnimes, setDifAnimes] = useState<Array<Anime>>([])

    async function updateAnimes() {
        const notUpdatedAnimes = await updateAnimesMAL(difAnimes)

        if (notUpdatedAnimes === undefined) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Internal Error',
                duration: 2500,
            })
            return
        }

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
            <Scraper
                setAnimes={setAnimes}
                setDifAnimes={setDifAnimes}
                available={available}
            />
            {animes.length > 0 && (
                <>
                    {difAnimes.length > 0 && (
                        <>
                            <div className="flex items-center">
                                <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                                    Missing on MAL
                                </h3>
                                <form action={updateAnimes}>
                                    <Button type="submit">Update MAL</Button>
                                </form>
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
