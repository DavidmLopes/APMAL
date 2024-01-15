'use client'

import { Button } from '@components/ui/button'
import { useTheme } from 'next-themes'
import Image from 'next/image'

export default function ThemeButton() {
    const { theme, setTheme } = useTheme()

    return (
        <div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-12 w-12 rounded-2xl"
            >
                <Image
                    src="sun.svg"
                    alt="Toogle theme"
                    width={24}
                    height={24}
                    className="scale-0 dark:scale-100"
                />
                <Image
                    src="moon.svg"
                    alt="Toogle theme"
                    width={24}
                    height={24}
                    className="absolute scale-100 dark:scale-0"
                />
            </Button>
        </div>
    )
}
