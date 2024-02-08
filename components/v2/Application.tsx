import Animes from './Animes'
import SearchAnimes from './SearchAnimes'
import UpdateAnimesButton from './UpdateAnimesButton'

export default function Application({ disable }: { disable: boolean }) {
    return (
        <div className="mx-auto max-w-screen-xl p-2">
            <SearchAnimes disable={disable} />
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
