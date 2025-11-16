import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

    // return the latest jauge record for the infrastructure
    const rows = await query(`SELECT jauge, max_jauge FROM Jauge WHERE idInfrastructure = ? ORDER BY id DESC LIMIT 1`, [id])
    if (!rows || rows.length === 0) return NextResponse.json({ jauge: null, max_jauge: null })
    const r = rows[0]
    return NextResponse.json({ jauge: r.jauge != null ? Number(r.jauge) : null, max_jauge: r.max_jauge != null ? Number(r.max_jauge) : null })
  } catch (e) {
    console.error('jauge api error', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
