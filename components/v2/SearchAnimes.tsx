'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { getUserAnimesAP, getUserAnimesMAL, mapAPtoMAL } from './actions'
import { AnimeAPMAL, AnimeAPMALInfo } from './types'

export default function SearchAnimes({
    disable,
    setAnimes,
}: {
    disable: boolean
    setAnimes: (animes: Array<AnimeAPMAL>) => void
}) {
    const [loading, setLoading] = useState<boolean>(false)

    async function scraperAction(data: FormData) {
        const username = data.get('username')
        if (!username || typeof username !== 'string') return

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }

        const apAnimes = await getUserAnimesAP(username)
        const animes = await mapAPtoMAL(apAnimes)

        const userAnimes = await getUserAnimesMAL()
        animes.forEach((anime, index) => {
            const userAnime = userAnimes.find(
                (userAnime) => userAnime.id === anime.mal?.id,
            )

            if (userAnime === undefined) return

            animes[index] = {
                ap: anime.ap,
                mal: userAnime,
                info: AnimeAPMALInfo.USER_HAVE,
            }
        })

        setAnimes(animes)
        setLoading(false)
    }

    return (
        <div>
            <div>
                <form
                    action={scraperAction}
                    className="flex w-full items-center space-x-2"
                    onSubmit={() => {
                        //setAnimes([])
                        setLoading(true)
                    }}
                >
                    <Input
                        type="text"
                        name="username"
                        placeholder="AnimePlanet Username"
                        disabled={disable || loading}
                    />
                    <Button type="submit" disabled={disable || loading}>
                        Search
                    </Button>
                </form>
                {loading && (
                    <div className="my-6 w-full text-center">
                        <span className="box-border inline-block h-12 w-12 animate-spin rounded-[50%] border-[5px] border-black border-b-transparent dark:border-white dark:border-b-transparent"></span>
                    </div>
                )}
            </div>
        </div>
    )
}
