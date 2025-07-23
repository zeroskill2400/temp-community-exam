import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET(request: NextRequest) {
  const { data, error } = await supabase.from("posts").select("*");
  return NextResponse.json(data);
}
