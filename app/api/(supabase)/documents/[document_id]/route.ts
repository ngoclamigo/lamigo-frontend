import { NextResponse, NextRequest} from "next/server";
import { createClient } from "~/lib/supabase-server";

export async function GET(_: NextRequest, { params }: { params: { document_id: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("documents")
      .select()
      .eq("id", params.document_id)
      .single();

    if (error) {
      console.error("Error fetching document:", error);
      return NextResponse.json({ status: "error", error: "Failed to fetch document" }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ status: "error", error: "Failed to fetch document" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { document_id: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("documents")
      .update(await request.json())
      .eq("id", params.document_id);

    if (error) {
      console.error("Error updating document:", error);
      return NextResponse.json({ status: "error", error: "Failed to update document" }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ status: "error", error: "Failed to update document" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { document_id: string } }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("documents")
      .delete()
      .eq("id", params.document_id);

    if (error) {
      console.error("Error deleting document:", error);
      return NextResponse.json({ status: "error", error: "Failed to delete document" }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ status: "error", error: "Failed to delete document" }, { status: 500 });
  }
}
