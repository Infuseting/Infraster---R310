"use client"

import React, { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [userType, setUserType] = useState<"PARTICULIER"|"ENTREPRISE"|"ASSOCIATION">("PARTICULIER")
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (password !== confirmPassword) {
			alert("Passwords do not match")
			return
		}
		setLoading(true)
		try {
			// Call register API
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password, type: userType }),
			})

			const data = await res.json()
			if (!res.ok) {
				alert(data?.error ?? 'Registration failed')
				return
			}

			// success - redirect to login
			window.location.href = '/login'
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create account</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<Label>Type de compte</Label>
							<div className="flex gap-4 mt-1">
								<label className="inline-flex items-center gap-2">
									<input
										type="radio"
										name="type"
										value="ASSOCIATION"
										checked={userType === "ASSOCIATION"}
										onChange={() => setUserType("ASSOCIATION")}
										className="accent-primary"
									/>
									<span>Association</span>
								</label>

								<label className="inline-flex items-center gap-2">
									<input
										type="radio"
										name="type"
										value="PARTICULIER"
										checked={userType === "PARTICULIER"}
										onChange={() => setUserType("PARTICULIER")}
										className="accent-primary"
									/>
									<span>Particulier</span>
								</label>

								<label className="inline-flex items-center gap-2">
									<input
										type="radio"
										name="type"
										value="ENTREPRISE"
										checked={userType === "ENTREPRISE"}
										onChange={() => setUserType("ENTREPRISE")}
										className="accent-primary"
									/>
									<span>Entreprise</span>
								</label>
							</div>
						</div>

							<div>
								<Label htmlFor="name">Full name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
								required
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
								required
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
								required
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="confirmPassword">Confirm password</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
								required
								className="mt-1"
							/>
						</div>

						<div className="flex items-center justify-between">
							<Button type="submit" disabled={loading}>
								{loading ? "Creating..." : "Create account"}
							</Button>
							<Link href="/login" className="text-sm text-muted-foreground">
								Already have an account?
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

