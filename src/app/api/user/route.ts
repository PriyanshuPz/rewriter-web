import { type NextRequest, NextResponse } from "next/server";

// Mock user data
const mockUser = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "Software developer passionate about building great products",
  createdAt: "2024-01-15T10:00:00.000Z",
};

// GET /api/user - Get user information
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement actual user fetching from database
    // const user = await prisma.users.findUnique({...});

    return NextResponse.json(mockUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}

// PATCH /api/user - Update user information
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bio } = body;

    // TODO: Implement actual user update in database
    // const user = await prisma.users.update({...});

    const updatedUser = {
      ...mockUser,
      name: name || mockUser.name,
      bio: bio || mockUser.bio,
    };

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user information" },
      { status: 500 }
    );
  }
}
