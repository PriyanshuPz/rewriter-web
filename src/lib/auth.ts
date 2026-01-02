import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { apiKey, customSession } from "better-auth/plugins";
import { prisma } from "./prisma";
import { generateId } from "./utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: (options) => {
        const prefix = options.model.substring(0, 4);
        return generateId(prefix);
      },
    },
  },
  appName: "Rewriter",
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GIHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GIHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          username: profile.login,
          bio: profile.bio,
        };
      },
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    nextCookies(),
    apiKey({
      enableSessionForAPIKeys: true,
    }),
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
          username: (user as any).username as string,
        },
        session,
      };
    }),
  ],
  experimental: { joins: true },
});
