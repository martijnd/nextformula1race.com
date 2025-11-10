import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'nl'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Check if pathname already has a locale
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1];
    return locales.includes(locale) ? locale : defaultLocale;
  }

  // Try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().split('-')[0].toLowerCase())
      .find((lang) => locales.includes(lang as (typeof locales)[number]));

    if (preferredLocale) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    // Add pathname to headers for not-found page to extract locale
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Get locale and redirect
  const locale = getLocale(request);
  const newPath = `/${locale}${pathname === '/' ? '' : pathname}`;
  const newUrl = new URL(newPath, request.url);

  // Preserve query parameters
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  // Add pathname to headers for not-found page to extract locale
  response.headers.set('x-pathname', newPath);
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - static files (files with extensions)
    // - favicon
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
