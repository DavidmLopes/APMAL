'use client'

import { useState } from 'react'
import Animes from './Animes'
import SearchAnimes from './SearchAnimes'
import UpdateAnimesButton from './UpdateAnimesButton'
import { AnimeAPMAL, AnimeAPMALInfo } from './types'
import { isSameStatus } from '@/lib/mal'

function difAnimes(animes: Array<AnimeAPMAL>) {
    return animes.filter(
        (anime) =>
            anime.info === AnimeAPMALInfo.FOUND ||
            (anime.info === AnimeAPMALInfo.USER_HAVE &&
                anime.mal != undefined &&
                'status' in anime.mal &&
                !isSameStatus(anime.ap.status, anime.mal?.status)) ||
            (anime.info === AnimeAPMALInfo.USER_HAVE &&
                anime.mal != undefined &&
                'num_episodes_watched' in anime.mal &&
                anime.ap.eps_watched !== '' &&
                Number(anime.ap.eps_watched) !==
                    anime.mal?.num_episodes_watched),
    )
}

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
            <Animes animes={difAnimes(animes)} />
            <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                NotFound
            </h3>
            <Animes
                animes={animes.filter(
                    (anime) => anime.info === AnimeAPMALInfo.NOT_FOUND,
                )}
            />
        </div>
    )
}
