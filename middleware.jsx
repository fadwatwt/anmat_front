// import { NextResponse } from "next/server";
//
// export function middleware(request) {
//     const token = request.cookies.get("token")?.value;
//
//     if (request.nextUrl.pathname.startsWith("/dashboard")) {
//         if (!token) {
//             return NextResponse.redirect(new URL("/login", request.url));
//         }
//     }
//
//     return NextResponse.next();
// }
