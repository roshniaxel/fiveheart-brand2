import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const cookies = req.headers.get("cookie") || ""; // ✅ Forward session cookies

    console.log("🔄 Logging purchase in Drupal:", orderData);

    const drupalResponse = await fetch("http://dev-fiveheart.pantheonsite.io/api/log-purchase?_format=json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // ✅ Explicitly set Accept header
        "Cookie": cookies, // ✅ Pass the user's session cookie
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    });

    if (!drupalResponse.ok) {
      const errorText = await drupalResponse.text();
      throw new Error(`Failed to log purchase in Drupal: ${drupalResponse.status} - ${errorText}`);
    }

    return NextResponse.json({ success: true, message: "Order logged in Drupal" });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("❌ Error logging purchase:", errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
