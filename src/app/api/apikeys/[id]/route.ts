import { type NextRequest, NextResponse } from "next/server";

// DELETE /api/apikeys/[id] - Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Implement actual API key deletion from database
    // await prisma.apikeys.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
