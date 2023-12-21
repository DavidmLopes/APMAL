import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

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

    const { access_token } = await fetch(
        'https://myanimelist.net/v1/oauth2/token',
        {
            method: 'POST',
            body: form,
        },
    )
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            return { access_token: data.access_token }
        })

    cookies().set('access_token', access_token)

    redirect('/')
}
