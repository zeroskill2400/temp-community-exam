import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET(request: NextRequest) {
  const data = {
    name: "John Doe",
    email: "john.doe@example.com",
  };
  return NextResponse.json(data);
}
