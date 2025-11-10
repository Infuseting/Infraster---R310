import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sp = url.searchParams

    const north = parseFloat(sp.get('north') ?? '')
    const south = parseFloat(sp.get('south') ?? '')
    const east = parseFloat(sp.get('east') ?? '')
    const west = parseFloat(sp.get('west') ?? '')
    let limit = parseInt(sp.get('limit') ?? '100', 10)

    if (![north, south, east, west].every(Number.isFinite)) {
      return NextResponse.json({ error: 'missing or invalid bbox params' }, { status: 400 })
    }

    if (!Number.isFinite(limit) || limit <= 0) limit = 100
    // enforce an absolute max of 100
    if (limit > 100) limit = 100

    // Ensure lat bounds order (south <= north)
    const latMin = Math.min(south, north)
    const latMax = Math.max(south, north)

  // Use a deterministic global seed so the random order is stable across bbox
  // (randomness applied on the entire dataset, not per-bbox). This ensures
  // the ordering does not change when users pan/zoom the map.
  const GLOBAL_SEED = 'global_v1'

    // For longitude, handle normal case and dateline-crossing case
    let rows: any[] = []

    if (west <= east) {
      // normal case: order by CRC32(CONCAT(idInfrastructure, GLOBAL_SEED)) so
      // the pseudo-random order is global and stable for all users.
      rows = await query(`SELECT idInfrastructure as id, name, adresse, latitude, longitude FROM Infrastructure WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? ORDER BY CRC32(CONCAT(idInfrastructure, ?)) LIMIT ?`, [latMin, latMax, west, east, GLOBAL_SEED, limit])
    } else {
      // bounding box crosses the dateline: lon >= west OR lon <= east
      rows = await query(`SELECT idInfrastructure as id, name, adresse, latitude, longitude FROM Infrastructure WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND latitude BETWEEN ? AND ? AND (longitude >= ? OR longitude <= ?) ORDER BY CRC32(CONCAT(idInfrastructure, ?)) LIMIT ?`, [latMin, latMax, west, east, GLOBAL_SEED, limit])
    }

    const items = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      adresse: r.adresse,
      lat: r.latitude ? parseFloat(r.latitude) : null,
      lon: r.longitude ? parseFloat(r.longitude) : null,
    }))

    return NextResponse.json(items)
  } catch (e) {
    console.error('infra bbox api error', e)
    return NextResponse.json([], { status: 500 })
  }
}
