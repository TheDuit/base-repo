import manifest from "../../../../system.manifest.json";

export const appConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  displayName: manifest.displayName,
  systemName: manifest.systemName
};
