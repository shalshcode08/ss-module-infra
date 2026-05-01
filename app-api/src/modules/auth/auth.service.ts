/**
 * AuthService handles the business logic for authentication and authorization.
 */

import { supabase } from "../../config/supabase";
import { prisma } from "../../db";
import { HttpError } from "../../shared/errors/HttpError";

export const AuthService = {
  login: async (token: string) => {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw HttpError.unauthorized("Invalid token");
    }

    const supabaseUser = data.user;

    const user = await prisma.user.upsert({
      where: {
        supabaseId: supabaseUser.id,
      },
      update: {
        name: supabaseUser.user_metadata?.full_name ?? null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
      },
      create: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name ?? "",
        avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
      },
    });

    return user;
  },
};
