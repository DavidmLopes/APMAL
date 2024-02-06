import type { Anime } from '@prisma/client'
import prisma from './prisma'

export async function createAnime(
    apId: number,
    apTitle: string,
    malId: number,
) {
    try {
        return await prisma.anime.create({
            data: {
                apId: apId,
                apTitle: apTitle,
                malId: malId,
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
            where: { apId: apId },
        })
    } catch (error) {
        console.log(error)
        throw new Error('Error getting anime')
    }
}

export async function getAnimeByMAL(malId: number): Promise<Anime | null> {
    if (!malId) {
        return null
    }
    try {
        return await prisma.anime.findUnique({
            where: { malId: malId },
        })
    } catch (error) {
        console.log(error)
        throw new Error('Error getting anime')
    }
}
