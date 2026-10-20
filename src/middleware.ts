import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase().split(':')[0];
  if (!host) {
    return NextResponse.next();
  }

  // Skip platform internal hosts, localhost, and portal subdomains
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.includes('tedelpa.com') ||
    host.startsWith('portal.')
  ) {
    return NextResponse.next();
  }

  // Check if current hostname has an active Public Real Estate Portal (Inmobiliaria Frontend) on root '/'
  if (request.nextUrl.pathname === '/' && !request.nextUrl.searchParams.has('dashboard')) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://santun.tedelpa.com/api';
      const inmoRes = await fetch(
        `${apiUrl}/v1/public/inmobiliaria/config?domain=${encodeURIComponent(host)}`,
        {
          headers: {
            Accept: 'application/json',
            'X-Domain': host,
          },
          cache: 'no-store',
        }
      );

      if (inmoRes.ok) {
        const inmoJson = await inmoRes.json();
        if (inmoJson?.data?.frontend_enabled && !inmoJson?.data?.redirect_to_login) {
          const rewriteUrl = request.nextUrl.clone();
          rewriteUrl.pathname = '/travel-agency-03';
          rewriteUrl.searchParams.set('domain', host);
          return NextResponse.rewrite(rewriteUrl);
        }
      }
    } catch {
      // Fall through if API check fails
    }
  }

  // Check if current hostname is configured as a custom domain for a landing page
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://santun.tedelpa.com/api';
    const res = await fetch(`${apiUrl}/v1/public/landing-domain-lookup?domain=${encodeURIComponent(host)}`, {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data?.redirect_url) {
        let redirectUrl = json.data.redirect_url;
        const search = request.nextUrl.search;
        if (search) {
          redirectUrl += (redirectUrl.includes('?') ? '&' : '?') + search.replace(/^\?/, '');
        }
        return NextResponse.redirect(new URL(redirectUrl), 302);
      }
    }
  } catch (err) {
    // Silently continue if API lookup is unreachable
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
