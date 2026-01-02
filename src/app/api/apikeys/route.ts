import { type NextRequest, NextResponse } from "next/server";

// Mock API keys data
const mockApiKeys = [
  {
    id: "key-1",
    name: "Production API Key",
    key: "rw_live_***************abc123",
    createdAt: "2024-12-01T10:00:00.000Z",
    lastUsed: "2024-12-28T15:30:00.000Z",
  },
  {
    id: "key-2",
    name: "Development Key",
    key: "rw_test_***************xyz789",
    createdAt: "2024-11-15T08:00:00.000Z",
    lastUsed: "2024-12-30T09:15:00.000Z",
  },
];

// GET /api/apikeys - List all API keys
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement actual API keys fetching from database
    // const apiKeys = await prisma.apikeys.findMany({...});

    return NextResponse.json(mockApiKeys);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST /api/apikeys - Generate a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "API key name is required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual API key generation and storage
    // const apiKey = await prisma.apikeys.create({...});

    const newApiKey = {
      id: `key-${Date.now()}`,
      name,
      key: `rw_live_${Math.random()
        .toString(36)
        .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };

    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}
