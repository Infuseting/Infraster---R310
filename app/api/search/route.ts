import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()

  if (!q) return NextResponse.json([], { status: 200 })

  try {
    // search name or adresse (case-insensitive)
    const like = `%${q}%`
    const rows = await query(`SELECT idInfrastructure as id, name, adresse, latitude, longitude FROM Infrastructure WHERE name LIKE ? OR adresse LIKE ? LIMIT 12`, [like, like])

    // normalize coordinates
    const items = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      adresse: r.adresse,
      lat: r.latitude ? parseFloat(r.latitude) : null,
      lon: r.longitude ? parseFloat(r.longitude) : null,
      source: 'infra'
    }))

    return NextResponse.json(items)
  } catch (e) {
    console.error('search api error', e)
    return NextResponse.json([], { status: 500 })
  }
}
