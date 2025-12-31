import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateId } from "@/lib/utils";
import { APIFault, resolveAPIErrors } from "../_api";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    if (limit < 1) {
      throw new APIFault("limit can't be less than 1", 400);
    }

    if (offset < 0) {
      throw new APIFault("offset can't be less than 0", 400);
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new APIFault("Unauthorized", 401);
    }

    const vaults = await prisma.vault.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        _count: {
          select: {
            pages: true,
          },
        },
      },

      skip: offset,
      take: limit,
    });

    const payload = vaults.map((vault) => {
      const pages = vault._count.pages;
      return {
        id: vault.id,
        title: vault.title,
        description: vault.description,
        icon: vault.icon,
        accentColor: vault.accentColor,
        updatedAt: vault.updatedAt,
        pagesCount: pages,
      };
    });

    return NextResponse.json({
      sucess: true,
      data: payload,
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/vaults");
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

    const { title, description, icon, accentColor } = body;

    if (!title || typeof title !== "string") {
      throw new APIFault("Title is required", 400);
    }

    if (title.length > 100) {
      throw new APIFault("Title is too long", 400);
    }

    if (description && typeof description !== "string") {
      throw new APIFault("Description must be a string", 400);
    }

    if (description && description.length > 500) {
      throw new APIFault("Description is too long", 400);
    }

    const vault = await prisma.vault.create({
      data: {
        id: generateId("vault"),
        title: title.trim(),
        description: description?.trim() || null,
        icon: icon || null,
        accentColor: accentColor || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: vault.id,
        title: vault.title,
        description: vault.description,
        icon: vault.icon,
        accentColor: vault.accentColor,
        updatedAt: vault.updatedAt,
        createdAt: vault.createdAt,
      },
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/vaults");
  }
}
