import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateId } from "@/lib/utils";
import { APIFault, resolveAPIErrors } from "../_api";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new APIFault("Unauthorized", 401);
    }

    const url = new URL(req.url);
    const vaultId = url.searchParams.get("vaultId");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    if (!vaultId) {
      throw new APIFault("vaultId is required", 400);
    }

    if (limit < 1) {
      throw new APIFault("limit can't be less than 1", 400);
    }

    if (offset < 0) {
      throw new APIFault("offset can't be less than 0", 400);
    }

    // Verify vault belongs to user
    const vault = await prisma.vault.findFirst({
      where: {
        id: vaultId,
        userId: session.user.id,
      },
    });

    if (!vault) {
      throw new APIFault("Vault not found", 404);
    }

    const pages = await prisma.page.findMany({
      where: {
        vaultId,
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        summary: true,
        thumbnail: true,
        tags: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/pages");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new APIFault("Unauthorized", 401);
    }

    const body = await req.json();
    const { vaultId, title, content, summary, thumbnail, tags } = body;

    if (!vaultId || typeof vaultId !== "string") {
      throw new APIFault("vaultId is required", 400);
    }

    if (!title || typeof title !== "string") {
      throw new APIFault("Title is required", 400);
    }

    if (title.length > 200) {
      throw new APIFault("Title is too long", 400);
    }

    if (!content || typeof content !== "string") {
      throw new APIFault("Content is required", 400);
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

    // Verify vault belongs to user
    const vault = await prisma.vault.findFirst({
      where: {
        id: vaultId,
        userId: session.user.id,
      },
    });

    if (!vault) {
      throw new APIFault("Vault not found", 404);
    }

    const page = await prisma.page.create({
      data: {
        id: generateId("pg"),
        title: title.trim(),
        content,
        summary: summary?.trim() || null,
        thumbnail: thumbnail || null,
        tags: tags || [],
        vaultId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: page.id,
        title: page.title,
        summary: page.summary,
        thumbnail: page.thumbnail,
        tags: page.tags,
        updatedAt: page.updatedAt,
        createdAt: page.createdAt,
      },
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/pages");
  }
}
