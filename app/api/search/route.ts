import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()
  // accept a 'limit' parameter from client, clamp to 1..100
  const rawLimit = parseInt(searchParams.get('limit') || '12', 10)
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(100, rawLimit)) : 12

  if (!q) return NextResponse.json([], { status: 200 })

  try {
    // search name or adresse (case-insensitive)
  const like = `%${q}%`
  // LIMIT cannot be parameterized in some DB drivers, ensure 'limit' is an integer we control
  const rows = await query(`SELECT idInfrastructure as id, name, adresse, latitude, longitude FROM Infrastructure WHERE name LIKE ? OR adresse LIKE ? LIMIT ${limit}`, [like, like])

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
