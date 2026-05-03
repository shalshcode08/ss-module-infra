class AppRoutes {
  static readonly HOME = "/home";
  static readonly LOGIN = "/login";
  static readonly NOT_FOUND = "*";
  static readonly CHAT = "/chat/:questionId";
  static readonly HISTORY = "/history";

  static chat(questionId: string) {
    return `/chat/${questionId}`;
  }
}

export default AppRoutes;
