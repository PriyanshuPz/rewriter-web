import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { APIFault, resolveAPIErrors } from "../../../_api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
      where: {
        slug,
        // mode: "PUBLIC",
      },
      include: {
        vault: {
          select: {
            title: true,
            icon: true,
            accentColor: true,
          },
        },
        user: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
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
    return resolveAPIErrors(error, "/api/pages/slug/[slug]");
  }
}
