import jwt from "jsonwebtoken";
import { config } from "../../config";
import { prisma } from "../../db";
import { HttpError } from "../../shared/errors/HttpError";
import { OAuthProvider } from "../../generated/prisma/enums";

export const AuthService = {
  getGoogleAuthUrl: (): string => {
    const params = new URLSearchParams({
      client_id: config.google.clientId,
      redirect_uri: config.google.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  handleCallback: async (code: string): Promise<string> => {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: config.google.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) throw HttpError.internal("Failed to exchange Google code");

    const tokens = (await tokenRes.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) throw HttpError.internal("Failed to get Google user info");

    const googleUser = (await userInfoRes.json()) as {
      sub: string;
      email: string;
      name: string;
      picture: string;
    };

    const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: { name: googleUser.name ?? null, avatarUrl: googleUser.picture ?? null },
      create: {
        email: googleUser.email,
        name: googleUser.name ?? null,
        avatarUrl: googleUser.picture ?? null,
      },
    });

    await prisma.oAuthAccount.upsert({
      where: {
        provider_providerUserId: {
          provider: OAuthProvider.GOOGLE,
          providerUserId: googleUser.sub,
        },
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        tokenExpiresAt,
      },
      create: {
        userId: user.id,
        provider: OAuthProvider.GOOGLE,
        providerUserId: googleUser.sub,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        tokenExpiresAt,
      },
    });

    return jwt.sign(
      { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
      config.jwtSecret,
      { expiresIn: "30d" },
    );
  },
};
