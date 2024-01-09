export async function getAnime(name: string) {
    const anime = await fetch(
        'https://api.myanimelist.net/v2/anime?q=' + name,
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

            data.data.forEach((element: { node: { title: string } }) => {
                if (element.node.title === name) {
                    anime = element.node.title
                    return
                }
            })

            return anime
        })
        .catch((err) => {
            return 'ERROR'
        })

    return anime
}
