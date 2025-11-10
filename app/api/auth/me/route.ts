import { NextResponse } from "next/server"
import { query } from "@/lib/db"

function parseCookies(cookieHeader: string | null) {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out
  const parts = cookieHeader.split(";")
  for (const part of parts) {
    const idx = part.indexOf("=")
    if (idx === -1) continue
    const k = part.slice(0, idx).trim()
    const v = part.slice(idx + 1).trim()
    out[k] = decodeURIComponent(v)
  }
  return out
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie")
    const cookies = parseCookies(cookieHeader)
    const token = cookies["access_token"] ?? null

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const rows = await query("SELECT u.name, u.email, u.`type` FROM access_token a JOIN `user` u ON a.idUser = u.idUser WHERE a.access_token = ? LIMIT 1", [token])
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const row = rows[0] as any
    return NextResponse.json({ name: row.name ?? null, email: row.email ?? null, type: row.type ?? null }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // Allow POST to support client-side fetch with body if needed: reuse GET logic
  return GET(req)
}
