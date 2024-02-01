'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { getAnimes } from './scraperAction'
import { AnimeAP } from '@/lib/ap'
import { AnimeMAL } from '@/lib/mal'
import { useState } from 'react'

export type Anime = {
    ap: AnimeAP
    mal: AnimeMAL | undefined
}

export default function Scraper({
    setAnimes,
    available,
}: {
    setAnimes: (animes: Array<Anime>) => void
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
