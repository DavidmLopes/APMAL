'use client'

import { useState } from 'react'
import Animes from './Animes'
import SearchAnimes from './SearchAnimes'
import UpdateAnimesButton from './UpdateAnimesButton'
import { AnimeAPMAL } from './types'

export default function Application({ disable }: { disable: boolean }) {
    const [animes, setAnimes] = useState<Array<AnimeAPMAL>>([])

    return (
        <div className="mx-auto max-w-screen-xl p-2">
            <SearchAnimes disable={disable} setAnimes={setAnimes} />
            <div className="flex items-center">
                <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                    Missing on MAL
                </h3>
                <UpdateAnimesButton />
            </div>
            <Animes />
            <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                NotFound
            </h3>
            <Animes />
        </div>
    )
}
