export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.soulsticetarot.com"
    : "http://localhost:8080";
