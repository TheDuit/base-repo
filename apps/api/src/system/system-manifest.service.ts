import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";

type SystemManifest = {
  aws: {
    defaultEnvironment: string;
    defaultRegion: string;
    projectName: string;
  };
  defaultLocale?: string;
  description?: string;
  displayName: string;
  systemName: string;
};

@Injectable()
export class SystemManifestService {
  private readonly manifest: SystemManifest;

  constructor() {
    this.manifest = this.loadManifest();
  }

  get systemName(): string {
    return this.manifest.systemName;
  }

  get displayName(): string {
    return this.manifest.displayName;
  }

  get awsProjectName(): string {
    return this.manifest.aws.projectName;
  }

  get defaultEnvironment(): string {
    return this.manifest.aws.defaultEnvironment;
  }

  get defaultRegion(): string {
    return this.manifest.aws.defaultRegion;
  }

  toJSON(): SystemManifest {
    return this.manifest;
  }

  private loadManifest(): SystemManifest {
    const manifestPath =
      process.env.SYSTEM_MANIFEST_PATH ?? findUpSystemManifest(process.cwd());

    if (!manifestPath) {
      throw new Error("system.manifest.json was not found");
    }

    const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as unknown;

    if (!isSystemManifest(parsed)) {
      throw new Error("system.manifest.json is invalid");
    }

    return {
      ...parsed,
      systemName: normalizeSystemName(parsed.systemName),
      aws: {
        ...parsed.aws,
        projectName: normalizeSystemName(parsed.aws.projectName)
      }
    };
  }
}

function findUpSystemManifest(startDirectory: string): string | null {
  let current = resolve(startDirectory);
  const root = parse(current).root;

  while (current !== root) {
    const candidate = join(current, "system.manifest.json");
    if (existsSync(candidate)) {
      return candidate;
    }
    current = dirname(current);
  }

  return null;
}

function isSystemManifest(value: unknown): value is SystemManifest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SystemManifest>;
  return (
    typeof candidate.systemName === "string" &&
    typeof candidate.displayName === "string" &&
    Boolean(candidate.aws) &&
    typeof candidate.aws?.projectName === "string" &&
    typeof candidate.aws?.defaultEnvironment === "string" &&
    typeof candidate.aws?.defaultRegion === "string"
  );
}

function normalizeSystemName(systemName: string): string {
  const normalized = systemName.trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(normalized)) {
    throw new Error(
      "systemName must use lowercase letters, numbers and hyphen only"
    );
  }

  return normalized;
}
