import { redirect } from 'next/navigation'

export default function Authorize() {
    const code_challenge = process.env.CODE_VERIFIER

    redirect(
        'https://myanimelist.net/v1/oauth2/authorize?' +
            `client_id=${process.env.MAL_CLIENT_ID}` +
            '&redirect_uri=http://localhost:3000/api/callback' +
            `&code_challenge=${code_challenge}` +
            '&response_type=code' +
            '&scope=write:users',
    )
}
