'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { getAnimes } from './scraperAction'
import { AnimeAP } from '@/lib/ap'
import { AnimeMAL } from '@/lib/mal'

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
    async function scraperAction(data: FormData) {
        const username = data.get('username')
        if (!username || typeof username !== 'string') return

        const animes = await getAnimes(username)

        setAnimes(animes)
    }

    return (
        <div>
            <form
                action={scraperAction}
                className="flex w-full items-center space-x-2"
            >
                <Input
                    type="text"
                    name="username"
                    placeholder="AnimePlanet Username"
                />
                <Button type="submit" disabled={!available}>
                    Search
                </Button>
            </form>
        </div>
    )
}
