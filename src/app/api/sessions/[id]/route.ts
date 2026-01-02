import { type NextRequest, NextResponse } from "next/server";

// DELETE /api/sessions/[id] - Revoke a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Implement actual session revocation from database
    // await prisma.sessions.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 }
    );
  }
}
