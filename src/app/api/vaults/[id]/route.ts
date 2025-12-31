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

    const vault = await prisma.vault.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            pages: true,
          },
        },
      },
    });

    if (!vault) {
      throw new APIFault("Vault not found", 404);
    }

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
        pageCount: vault._count.pages,
      },
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/vaults/[id]");
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

    const { title, description, icon, accentColor } = body;

    if (title && typeof title !== "string") {
      throw new APIFault("Title must be a string", 400);
    }

    if (title && title.length > 100) {
      throw new APIFault("Title is too long", 400);
    }

    if (description && typeof description !== "string") {
      throw new APIFault("Description must be a string", 400);
    }

    if (description && description.length > 500) {
      throw new APIFault("Description is too long", 400);
    }

    const vault = await prisma.vault.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!vault) {
      throw new APIFault("Vault not found", 404);
    }

    const updatedVault = await prisma.vault.update({
      where: {
        id,
      },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(icon !== undefined && { icon: icon || null }),
        ...(accentColor !== undefined && { accentColor: accentColor || null }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedVault.id,
        title: updatedVault.title,
        description: updatedVault.description,
        icon: updatedVault.icon,
        accentColor: updatedVault.accentColor,
        updatedAt: updatedVault.updatedAt,
      },
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/vaults/[id]");
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

    const vault = await prisma.vault.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!vault) {
      throw new APIFault("Vault not found", 404);
    }

    await prisma.vault.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vault deleted successfully",
    });
  } catch (error) {
    return resolveAPIErrors(error, "/api/vaults/[id]");
  }
}
