import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

    // fetch weekly opening days
    const weeklyRows = await query(`SELECT oj.jour FROM Ouverture_Jour oj JOIN Infra_Ouverture io ON io.id = oj.id_ouverture WHERE io.idInfrastructure = ?`, [id])
    const weekly = (weeklyRows || []).map((r: any) => (r.jour))

    // fetch exceptions (closures / special openings)
    const excRows = await query(`SELECT oe.date_debut as date_debut, oe.date_fin as date_fin, oe.type as type FROM Ouverture_Exception oe JOIN Infra_Ouverture io ON io.id = oe.id_ouverture WHERE io.idInfrastructure = ?`, [id])
    const exceptions = (excRows || []).map((r: any) => ({ date_debut: r.date_debut, date_fin: r.date_fin, type: r.type }))

    return NextResponse.json({ weekly, exceptions })
  } catch (e) {
    console.error('availability api error', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
