import type { Anime } from '@prisma/client'
import prisma from './prisma'

export async function createAnime(apId: number, malId: number) {
    try {
        return await prisma.anime.create({
            data: {
                ap: apId,
                mal: malId,
            },
        })
    } catch (error) {
        console.log(error)
        throw new Error('Error creating anime')
    }
}

export async function getAnimeByAP(apId: number): Promise<Anime | null> {
    if (!apId) {
        return null
    }
    try {
        return await prisma.anime.findUnique({
            where: { ap: apId },
        })
    } catch (error) {
        console.log(error)
        throw new Error('Error getting anime')
    }
}
