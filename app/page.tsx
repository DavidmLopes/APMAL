import Scraper from '@/components/Scraper'
import ThemeButton from '@/components/ThemeButton'

export default async function Home() {
    return (
        <div>
            <div className="flex w-full items-center justify-between space-x-2 bg-neutral-100 p-2 dark:bg-neutral-900">
                <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
                    APMAL
                </h1>
                <ThemeButton />
            </div>
            <div className="p-2">
                <Scraper />
            </div>
        </div>
    )
}
