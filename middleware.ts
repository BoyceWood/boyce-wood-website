import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isLoginPath = request.nextUrl.pathname === '/admin/login'
  
  // Laisse toujours passer /admin/login sans vérification
  if (isLoginPath) {
    return NextResponse.next()
  }

  // Pour les autres pages /admin, vérifie le cookie Supabase
  const hasSession = request.cookies.has('sb-access-token') || 
    [...request.cookies.getAll()].some(c => c.name.includes('auth-token'))

  if (!hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
