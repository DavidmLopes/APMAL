import Scraper from '@/components/Scraper'
import ThemeButton from '@/components/ThemeButton'

export default async function Home() {
    return (
        <div>
            <div className="flex w-full items-center space-x-2 bg-neutral-100 p-2 dark:bg-neutral-900">
                <Scraper />
                <ThemeButton />
            </div>
        </div>
    )
}
