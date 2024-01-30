import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createUser } from '@/lib/users'

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code') ?? ''

    const form = new FormData()
    form.append('code', code ? code : '')
    form.append(
        'client_id',
        process.env.MAL_CLIENT_ID ? process.env.MAL_CLIENT_ID : '',
    )
    form.append(
        'client_secret',
        process.env.MAL_CLIENT_SECRET ? process.env.MAL_CLIENT_SECRET : '',
    )
    form.append('redirect_uri', 'http://localhost:3000/api/callback') // TODO: Maybe not good to hardcode this
    form.append('grant_type', 'authorization_code')
    form.append(
        'code_verifier',
        process.env.CODE_VERIFIER ? process.env.CODE_VERIFIER : '',
    )

    const { access_token, refresh_token } = await fetch(
        'https://myanimelist.net/v1/oauth2/token',
        {
            method: 'POST',
            body: form,
        },
    )
        .then((res) => res.json())
        .then((data) => {
            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            }
        })

    const { name, picture } = await fetch(
        'https://api.myanimelist.net/v2/users/@me',
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        },
    )
        .then((res) => res.json())
        .then((data) => {
            return { name: data.name, picture: data.picture }
        })

    const user = await createUser({
        name: name,
        picture: picture,
        access_token: access_token,
        refresh_token: refresh_token,
    })

    cookies().set('userId', user.id)

    redirect('/')
}
