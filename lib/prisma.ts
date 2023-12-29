import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
    throw new Error('Invalid/Missing environment variable: "DATABASE_URL"')
}

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
    global.prisma = prisma
}

export default prisma
