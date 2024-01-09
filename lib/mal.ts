export async function getAnime(name: string) {
    const anime = await fetch(
        'https://api.myanimelist.net/v2/anime?q=' +
            name +
            '&fields=alternative_titles',
        {
            method: 'GET',
            headers: {
                'X-MAL-CLIENT-ID': `${process.env.MAL_CLIENT_ID}`,
            },
        },
    )
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            let anime = 'NOT FOUND'

            data.data.forEach(
                (element: {
                    node: {
                        title: string
                        alternative_titles: {
                            synonyms: Array<string>
                            en: string
                        }
                    }
                }) => {
                    if (element.node.title === name) {
                        anime = element.node.title
                        return
                    }

                    element.node.alternative_titles.synonyms.forEach(
                        (synonym) => {
                            if (synonym === name) {
                                anime = element.node.title
                                return
                            }
                        },
                    )

                    if (element.node.alternative_titles.en === name) {
                        anime = element.node.title
                        return
                    }
                },
            )

            return anime
        })
        .catch((err) => {
            return 'ERROR'
        })

    return anime
}
