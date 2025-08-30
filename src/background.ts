import { SessionManager } from "./background/sessionmanagement";

SessionManager.getInstance().catch((e) =>
  console.error("Error when creating instance of SessionManager:", e),
)
