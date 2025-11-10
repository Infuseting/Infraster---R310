import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(req: Request) {
  try {
    // Accept token either via Authorization header "Bearer <token>" or JSON body { token }
    const auth = req.headers.get("authorization")
    let token: string | null = null
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      token = auth.slice(7)
    } else {
      try {
        const body = await req.json()
        token = body?.token ?? null
      } catch (e) {
        token = null
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 })
    }

    const rows = await query("SELECT idUser FROM access_token WHERE access_token = ?", [token])
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const row = rows[0] as any
    return NextResponse.json({ ok: true, idUser: row.idUser }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
