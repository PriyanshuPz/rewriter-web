import { NextResponse } from "next/server";

export class APIFault {
  name: string;
  message: string | object;
  statusCode: number;
  stack?: string;

  constructor(message: string | object, statusCode: number) {
    this.name = "APIFault"; // Custom error name
    this.message = message;
    this.statusCode = statusCode;
    this.formatError = this.formatError.bind(this);
  }

  formatError() {
    return {
      error: this.message,
    };
  }
}

export function resolveAPIErrors(
  error: unknown,
  route: string = "[API_ERROR]"
) {
  let formattedError: { error: string | object };

  if (error instanceof APIFault) {
    formattedError = error.formatError();
    console.log(route, {
      ...formattedError,
      statusCode: error.statusCode,
    });
    return NextResponse.json(
      { success: false, ...formattedError },
      { status: error.statusCode }
    );
  }

  formattedError = {
    error: error instanceof Error ? error.message : "Unknown error occurred",
  };

  console.log(route, {
    ...formattedError,
    statusCode: 500,
  });

  return NextResponse.json(
    { success: false, ...formattedError },
    { status: 500 }
  );
}
