import type { Metadata } from "next";
import type { ReactNode } from "react";

import { appConfig } from "../config/app-config";
import { AppProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.displayName,
  description: "Base generica para sistemas web."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
