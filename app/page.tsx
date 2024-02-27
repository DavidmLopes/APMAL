import { Button } from '@/components/ui/button'
import { ChevronRightCircle, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
    return (
        <div className="flex flex-col items-center gap-4 px-4 py-16 text-center md:px-6">
            <div className="flex w-11/12 items-center gap-4 sm:w-2/3 md:w-1/2">
                <div className="relative aspect-square w-full">
                    <Image
                        alt="Hero"
                        className="rounded-lg object-cover object-center"
                        src="/AP.svg"
                        fill
                    />
                </div>
                <RefreshCw className="h-full w-1/2" strokeWidth={3} />
                <div className="relative aspect-square w-full ">
                    <Image
                        alt="Hero"
                        className="rounded-lg object-cover object-center"
                        src="/MAL.svg"
                        fill
                    />
                </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Sync Your Anime Lists
            </h1>
            <p className="px-8 text-center text-gray-500 md:text-xl dark:text-gray-400">
                Manage your anime watchlist across platforms with ease
            </p>
            <Button>
                <Link href="/APtoMAL" className="flex items-center gap-2">
                    Anime-Planet <ChevronRightCircle /> MyAnimeList
                </Link>
            </Button>
        </div>
    )
}
