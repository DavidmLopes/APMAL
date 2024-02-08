'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function SearchAnimes({ disable }: { disable: boolean }) {
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <div>
            <div>
                <form
                    className="flex w-full items-center space-x-2"
                    onSubmit={() => {
                        //setAnimes([])
                        setLoading(true)
                    }}
                >
                    <Input
                        type="text"
                        name="username"
                        placeholder="AnimePlanet Username"
                        disabled={disable || loading}
                    />
                    <Button type="submit" disabled={disable || loading}>
                        Search
                    </Button>
                </form>
                {loading && (
                    <div className="my-6 w-full text-center">
                        <span className="box-border inline-block h-12 w-12 animate-spin rounded-[50%] border-[5px] border-black border-b-transparent dark:border-white dark:border-b-transparent"></span>
                    </div>
                )}
            </div>
        </div>
    )
}
