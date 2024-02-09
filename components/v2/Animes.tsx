'use client'

import { AnimeAPMAL, AnimeAPMALInfo } from './types'
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogClose,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { AspectRatio } from '../ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card'
import Image from 'next/image'
import { AnimeStatus } from '@/lib/ap'

function statusToColor(status: AnimeStatus | undefined) {
    switch (status) {
        case AnimeStatus.WATCHED:
            return 'text-[#6f99e4]'
        case AnimeStatus.WATCHING:
            return 'text-[#8DEA43]'
        case AnimeStatus.WANT_TO_WATCH:
            return 'text-[#FCFC3C]'
        case AnimeStatus.STALLED:
            return 'text-[#FC9F3C]'
        case AnimeStatus.DROPPED:
            return 'text-[#d93d48]'
        default:
            return 'text-black'
    }
}

export default function Animes({ animes }: { animes: Array<AnimeAPMAL> }) {
    return (
        <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-2 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {animes.map((anime) => (
                <Card
                    key={anime.ap.title}
                    className="flex flex-col overflow-hidden"
                >
                    <CardTitle className="pt-3 text-xl">
                        <div className="w-full text-center">
                            <span className={statusToColor(anime.ap.status)}>
                                &#11044;
                            </span>
                            {' ' + anime.ap.status}
                        </div>
                    </CardTitle>
                    <CardContent className="pt-3">
                        <AspectRatio ratio={4 / 6}>
                            <Image
                                src={anime.ap.image}
                                alt={'Image of ' + anime.ap.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                                sizes="100%" //Need to optimze this
                            />
                        </AspectRatio>
                    </CardContent>
                    <CardFooter className="h-full flex-col justify-between">
                        <div className="mb-2 text-center">{anime.ap.title}</div>
                        {anime.info !== AnimeAPMALInfo.NOT_FOUND ? (
                            <SeeDifs anime={anime} />
                        ) : (
                            <SetAnime anime={anime} />
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

function Bold({ children }: { children: React.ReactNode }) {
    return <span className="font-bold">{children}</span>
}

function SeeDifs({ anime }: { anime: AnimeAPMAL }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                    More Info
                </Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Differents</DialogTitle>
                    <DialogDescription>
                        More details about differences
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-5">
                    <div className="col-span-2">
                        <div className="mb-2 font-bold">AnimePlanet</div>
                        <AspectRatio ratio={4 / 6}>
                            <Image
                                src={anime.ap.image}
                                alt={'Image of ' + anime.ap.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                                sizes="100%" //Need to optimze this
                            />
                        </AspectRatio>
                        <div>
                            <Bold>Name:</Bold> {anime.ap.title}
                        </div>
                        <div>
                            <Bold>Status:</Bold> {anime.ap.status}
                        </div>
                        {anime.ap.eps_watched != undefined &&
                            anime.ap.eps_watched != '' && (
                                <div>
                                    <Bold>Eps:</Bold> {anime.ap.eps_watched}
                                </div>
                            )}
                    </div>
                    <div className="text-center">{'<- ->'}</div>
                    {anime.mal != undefined && (
                        <div className="col-span-2">
                            <div className="mb-2 font-bold">MyAnimeList</div>
                            <AspectRatio ratio={4 / 6}>
                                <Image
                                    src={anime.mal.image}
                                    alt={'Image of ' + anime.mal.title}
                                    fill
                                    style={{
                                        objectFit: 'cover',
                                    }}
                                    className="rounded-md"
                                    sizes="100%" //Need to optimze this
                                />
                            </AspectRatio>
                            <div>
                                <Bold>Name:</Bold> {anime.mal?.title}
                            </div>
                            {'status' in anime.mal &&
                                anime.mal.status != undefined && (
                                    <div>
                                        <Bold>Status:</Bold> {anime.mal?.status}
                                    </div>
                                )}
                            {'num_episodes_watched' in anime.mal &&
                                anime.ap.eps_watched !== '' &&
                                Number(anime.ap.eps_watched) !==
                                    anime.mal?.num_episodes_watched && (
                                    <div>
                                        <Bold>Eps:</Bold>{' '}
                                        {anime.mal?.num_episodes_watched}
                                    </div>
                                )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose className="w-full">
                        <Button className="w-full">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SetAnime({ anime }: { anime: AnimeAPMAL }) {
    return (
        <Button className="w-full" variant="outline">
            Set Anime
        </Button>
    )
}
