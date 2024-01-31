import type { User } from '@prisma/client'
import prisma from './prisma'

export async function createUser(user: Omit<User, 'id'>) {
    try {
        return await prisma.user.upsert({
            where: { name: user.name },
            update: {
                access_token: user.access_token,
                refresh_token: user.refresh_token,
            },
            create: user,
        })
    } catch (error) {
        console.log(error)
        throw new Error('Error creating user')
    }
}

export async function getUser(id: string) {
    if (!id) {
        return null
    }
    try {
        return await prisma.user.findUnique({
            where: { id: id },
        })
    } catch (error) {
        console.log(error)
        throw new Error('Error getting user')
    }
}
