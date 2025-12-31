import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APIFault, resolveAPIErrors } from "../../_api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new APIFault("Unauthorized", 401);
    }

    const { id } = await params;

    const page = await prisma.page.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!page) {
      throw new APIFault("Page not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/pages/[id]");
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new APIFault("Unauthorized", 401);
    }

    const { id } = await params;
    const body = await req.json();

    const { title, content, summary, thumbnail, tags } = body;

    if (title && typeof title !== "string") {
      throw new APIFault("Title must be a string", 400);
    }

    if (title && title.length > 200) {
      throw new APIFault("Title is too long", 400);
    }

    if (content && typeof content !== "string") {
      throw new APIFault("Content must be a string", 400);
    }

    if (summary && typeof summary !== "string") {
      throw new APIFault("Summary must be a string", 400);
    }

    if (summary && summary.length > 500) {
      throw new APIFault("Summary is too long", 400);
    }

    if (tags && !Array.isArray(tags)) {
      throw new APIFault("Tags must be an array", 400);
    }

    const page = await prisma.page.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!page) {
      throw new APIFault("Page not found", 404);
    }

    const updatedPage = await prisma.page.update({
      where: {
        id,
      },
      data: {
        ...(title && { title: title.trim() }),
        ...(content && { content }),
        ...(summary !== undefined && { summary: summary?.trim() || null }),
        ...(thumbnail !== undefined && { thumbnail: thumbnail || null }),
        ...(tags !== undefined && { tags }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPage,
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/pages/[id]");
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new APIFault("Unauthorized", 401);
    }

    const { id } = await params;

    const page = await prisma.page.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!page) {
      throw new APIFault("Page not found", 404);
    }

    await prisma.page.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/pages/[id]");
  }
}
