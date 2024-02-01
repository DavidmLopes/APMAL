import { AnimeAP, AnimeStatus } from '@/lib/ap'
import { AspectRatio } from './ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardTitle } from './ui/card'
import Image from 'next/image'
import { AnimeMAL } from '@/lib/mal'
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogClose,
} from './ui/dialog'
import { Button } from './ui/button'

type Anime = {
    ap: AnimeAP
    mal: AnimeMAL | undefined
}

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

export default function Animes({ animes }: { animes: Array<Anime> }) {
    return (
        <div className="mx-auto grid max-w-screen-xl grid-cols-6 gap-2 p-2">
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full">More Info</Button>
                            </DialogTrigger>
                            <DialogContent className="">
                                <DialogHeader>
                                    <DialogTitle>Info</DialogTitle>
                                    <DialogDescription>
                                        More details about differences
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-3">
                                    <div>
                                        <div className="font-bold">
                                            AnimePlanet
                                        </div>
                                        <AspectRatio ratio={4 / 6}>
                                            <Image
                                                src={anime.ap.image}
                                                alt={
                                                    'Image of ' + anime.ap.title
                                                }
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                className="rounded-md"
                                                sizes="100%" //Need to optimze this
                                            />
                                        </AspectRatio>
                                        <div>Id: {anime.ap.id}</div>
                                        <div>Name: {anime.ap.title}</div>
                                        <div>Status: {anime.ap.status}</div>
                                        {anime.ap.eps_watched != undefined &&
                                            anime.ap.eps_watched != '' && (
                                                <div>
                                                    Eps: {anime.ap.eps_watched}
                                                </div>
                                            )}
                                    </div>
                                    <div className="text-center">{'<- ->'}</div>
                                    {anime.mal != undefined && (
                                        <div>
                                            <div className="font-bold">
                                                MyAnimeList
                                            </div>
                                            <AspectRatio ratio={4 / 6}>
                                                <Image
                                                    src={anime.mal.image}
                                                    alt={
                                                        'Image of ' +
                                                        anime.mal.title
                                                    }
                                                    fill
                                                    style={{
                                                        objectFit: 'cover',
                                                    }}
                                                    className="rounded-md"
                                                    sizes="100%" //Need to optimze this
                                                />
                                            </AspectRatio>
                                            <div>Name: {anime.mal?.title}</div>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <DialogClose className="w-full">
                                        <Button className="w-full">
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
