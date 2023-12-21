import Link from 'next/link'

export default function Home() {
    return (
        <div>
            <Link href={'/authorize'}>
                <div className="bg-highlights hover:bg-highlights-h inline-block rounded-lg px-6 py-2 text-center font-medium">
                    Authorize
                </div>
            </Link>
        </div>
    )
}
