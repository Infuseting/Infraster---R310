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

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie")
    const cookies = parseCookies(cookieHeader)
    const token = cookies["access_token"] ?? null

    if (token) {
      try {
        await query("DELETE FROM access_token WHERE access_token = ?", [token])
      } catch (e) {
        // ignore DB deletion errors and continue to clear cookie
        console.error("Failed to delete access_token:", e)
      }
    }

    // Clear cookie
    const clearCookie = `access_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure`

    return NextResponse.json({ ok: true }, { status: 200, headers: { "Set-Cookie": clearCookie } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

// Allow GET for convenience if someone navigates directly
export async function GET(req: Request) {
  return POST(req)
}
