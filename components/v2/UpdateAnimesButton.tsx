'use client'

import { Button } from '../ui/button'
import { updateAnimesMAL } from './actions'
import { AnimeAPMAL } from './types'

export default function UpdateAnimesButton({
    animes,
    update,
}: {
    animes: Array<AnimeAPMAL>
    update: (animes: Array<AnimeAPMAL>) => void
}) {
    async function updateAnimes() {
        const notUpdatedAnimes = await updateAnimesMAL(animes)

        if (notUpdatedAnimes === undefined) {
            return
        }

        update(notUpdatedAnimes)
    }

    return (
        <form action={updateAnimes}>
            <Button type="submit">Update MAL</Button>
        </form>
    )
}
