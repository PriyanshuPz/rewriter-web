import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  appName: "Rewriter",
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GIHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GIHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  experimental: { joins: true },
});
