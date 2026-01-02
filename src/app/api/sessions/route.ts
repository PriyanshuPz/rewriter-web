import { type NextRequest, NextResponse } from "next/server";

// Mock sessions data
const mockSessions = [
  {
    id: "session-1",
    device: "Chrome on Windows",
    location: "New York, USA",
    ipAddress: "192.168.1.1",
    lastActive: "2025-01-01T12:00:00.000Z",
    current: true,
  },
  {
    id: "session-2",
    device: "Safari on iPhone",
    location: "San Francisco, USA",
    ipAddress: "192.168.1.2",
    lastActive: "2024-12-30T18:30:00.000Z",
    current: false,
  },
  {
    id: "session-3",
    device: "Firefox on macOS",
    location: "Los Angeles, USA",
    ipAddress: "192.168.1.3",
    lastActive: "2024-12-28T10:15:00.000Z",
    current: false,
  },
];

// GET /api/sessions - List all active sessions
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement actual sessions fetching from database
    // const sessions = await prisma.sessions.findMany({...});

    return NextResponse.json(mockSessions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
