import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    client_id: "77c628f0-3e3f-4ea3-b8b1-909801839c6a",
    response_type: 'code',
    redirect_uri: "http://localhost:54321/redirect",
    scope: 'openid profile email'
  })

  const authorizationUrl = `https://api.supabase.com/v1/oauth/authorize?${params.toString()}`
  return NextResponse.redirect(authorizationUrl)
}

