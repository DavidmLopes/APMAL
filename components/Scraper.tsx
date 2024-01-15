'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { Anime, getAnimes } from './scraperAction'
import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardTitle } from './ui/card'
import { AspectRatio } from './ui/aspect-ratio'

export default function Scraper() {
    const [animes, setAnimes] = useState<Array<Anime>>([])

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
                <Button type="submit">Search</Button>
            </form>
            <div className="mx-auto grid max-w-screen-xl grid-cols-6 gap-2 p-2">
                {animes.map((anime) => (
                    <Card key={anime.ap.title}>
                        <CardContent className="pt-3">
                            <AspectRatio ratio={4 / 6}>
                                <Image
                                    src={anime.ap.image}
                                    alt={'Image of ' + anime.ap.title}
                                    layout="fill"
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-md"
                                />
                            </AspectRatio>
                        </CardContent>
                        <CardFooter>
                            <div className="w-full text-center">
                                {anime.ap.title}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
