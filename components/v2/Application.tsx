'use client'

import { useEffect, useState } from 'react'
import Animes from './Animes'
import SearchAnimes from './SearchAnimes'
import UpdateAnimesButton from './UpdateAnimesButton'
import { AnimeAPMAL, AnimeAPMALInfo } from './types'
import { isSameStatus } from '@/lib/mal'

function getDifAnimes(animes: Array<AnimeAPMAL>) {
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

    const [difAnimes, setDifAnimes] = useState<Array<AnimeAPMAL>>([])
    const [notFoundAnimes, setNotFoundAnimes] = useState<Array<AnimeAPMAL>>([])

    useEffect(() => {
        setDifAnimes(getDifAnimes(animes))
        setNotFoundAnimes(
            animes.filter((anime) => anime.info === AnimeAPMALInfo.NOT_FOUND),
        )
    }, [animes])

    return (
        <div className="mx-auto max-w-screen-xl p-2">
            <SearchAnimes disable={disable} setAnimes={setAnimes} />
            <MissingOnMAL animes={difAnimes} />
            <NotFound animes={notFoundAnimes} />
        </div>
    )
}

function MissingOnMAL({ animes }: { animes: Array<AnimeAPMAL> }) {
    if (animes.length === 0) return null

    return (
        <>
            <div className="flex items-center">
                <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                    Missing on MAL
                </h3>
                <UpdateAnimesButton />
            </div>
            <Animes animes={animes} />
        </>
    )
}

function NotFound({ animes }: { animes: Array<AnimeAPMAL> }) {
    if (animes.length === 0) return null

    return (
        <>
            <h3 className="m-4 scroll-m-20 text-4xl font-semibold tracking-tight">
                NotFound
            </h3>
            <Animes animes={animes} />
        </>
    )
}
