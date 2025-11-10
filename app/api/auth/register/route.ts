import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, type } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // basic type validation - fallback to PARTICULIER when invalid
    const allowed = ["PARTICULIER", "ENTREPRISE", "COLLECTIVITE", "ASSOCIATION"]
    const userType = allowed.includes(type) ? type : "PARTICULIER"

    // Check if email already exists
    const existing = await query("SELECT idUser FROM `user` WHERE email = ?", [email])
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password with sha256 (same as login)
    const hashed = crypto.createHash("sha256").update(password).digest("hex")

    const res = await query("INSERT INTO `user` (email, password, `type`, `name`) VALUES (?, ?, ?, ?)", [
      email,
      hashed,
      userType,
      name,
    ])

    return NextResponse.json({ ok: true, inserted: (res as any)?.insertId ?? null }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
