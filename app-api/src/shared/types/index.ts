export type JwtUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
