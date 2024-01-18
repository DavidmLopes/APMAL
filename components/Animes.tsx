import { AnimeAP } from '@/lib/ap'
import { AspectRatio } from './ui/aspect-ratio'
import { Card, CardContent, CardFooter } from './ui/card'
import Image from 'next/image'
import { AnimeMAL } from '@/lib/mal'

type Anime = {
    ap: AnimeAP
    mal: AnimeMAL | undefined
}

export default function Animes({ animes }: { animes: Array<Anime> }) {
    return (
        <div className="mx-auto grid max-w-screen-xl grid-cols-6 gap-2 p-2">
            {animes.map((anime) => (
                <Card key={anime.ap.title}>
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
