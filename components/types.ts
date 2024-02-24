import { AnimeAP } from '@/lib/ap'
import { AnimeMAL, SimpleAnimeMAL } from '@/lib/mal'

export enum AnimeAPMALInfo {
    NOT_FOUND = -1,
    FOUND = 0,
    USER_HAVE = 1,
}

export type AnimeAPMAL = {
    ap: AnimeAP
    mal: AnimeMAL | SimpleAnimeMAL | undefined
    info: AnimeAPMALInfo
}
