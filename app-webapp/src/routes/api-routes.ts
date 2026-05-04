class API_ROUTES {
  static readonly HEALTH = "/health";

  static readonly AUTH_GOOGLE = "/auth/google";
  static readonly AUTH_ME = "/auth/me";
  static readonly AUTH_LOGOUT = "/auth/logout";

  static readonly USER_CONFIG = "/config";

  static readonly CONVERSATIONS_CREATE = "/conversations/create";
  static readonly CONVERSATIONS_HISTORY = "/conversations/history";
  static readonly CONVERSATIONS_HOME = "/conversations/home";

  static conversationsStream(questionId: string) {
    return `/conversations/stream/${questionId}`;
  }

  static conversationsQuestion(questionId: string) {
    return `/conversations/question/${questionId}`;
  }
}

export default API_ROUTES;
