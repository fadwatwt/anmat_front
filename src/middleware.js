import { NextResponse } from "next/server";

const TOKEN_COOKIE = "token";

// مسارات ما قبل الدخول — لا تتطلب توكن
const PUBLIC_PREFIXES = [
  "/sign-in",
  "/admin/sign-in",
  "/forget-password",
  "/register",
  "/verify",
  "/mail-invitation",
];

// ملفات وأصول عامة دائماً
const PUBLIC_EXACT = new Set(["/", "/favicon.ico", "/icon.svg", "/manifest.json"]);

function isPublicPath(pathname) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/locales") ||
    pathname.startsWith("/fonts") ||
    pathname === "/api"
  )
    return true;
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // طرد مبكر خفيف: فحص وجود فقط — التحقق التفصيلي يبقى في (dashboard)/layout.jsx
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    // نحفظ الوجهة للعودة بعد الدخول إن أردنا استخدامها لاحقاً
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// نستثني ملفات Next الداخلية و api من المرور على Middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
