import React from 'react'
import { Metadata } from 'next'
import ExpandedMode from '@/components/customs/tokens/expanded-mode'

export const metadata: Metadata = {
    title: 'Expanded Mode',
    description: 'Expanded Mode',
}

async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <ExpandedMode tokenMint={id} />
    )
}
export default Page
