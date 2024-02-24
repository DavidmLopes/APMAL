'use client'

import { Button } from './ui/button'
import { updateAnimesMAL } from './actions'
import { AnimeAPMAL } from './types'
import { toast } from './ui/use-toast'

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
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Internal Error',
                duration: 2500,
            })
            return
        }

        if (notUpdatedAnimes === undefined) {
            return
        }

        update(notUpdatedAnimes)

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
        <form action={updateAnimes}>
            <Button type="submit">Update MAL</Button>
        </form>
    )
}
