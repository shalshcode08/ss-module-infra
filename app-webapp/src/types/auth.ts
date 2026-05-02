export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export type UserConfig = {
  id: string;
  userId: string;
  isPremium: boolean;
};
