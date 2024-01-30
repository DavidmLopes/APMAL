import { AnimeAP, AnimeStatus } from '@/lib/ap'
import { AspectRatio } from './ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardTitle } from './ui/card'
import Image from 'next/image'
import { AnimeMAL } from '@/lib/mal'

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
                <Card key={anime.ap.title}>
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
                    <CardFooter>
                        <div className="w-full text-center">
                            {anime.ap.title}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
