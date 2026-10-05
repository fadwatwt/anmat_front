import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        { error: "This endpoint is disabled. Use the authenticated subscription API." },
        { status: 410 }
    );
}
