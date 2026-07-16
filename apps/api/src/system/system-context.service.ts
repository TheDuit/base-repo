import { Injectable } from "@nestjs/common";

import { SystemManifestService } from "./system-manifest.service";

@Injectable()
export class SystemContextService {
  readonly displayName: string;
  readonly systemName: string;

  constructor(manifest: SystemManifestService) {
    this.systemName = manifest.systemName;
    this.displayName = manifest.displayName;
  }

  buildDynamoPartitionKey(entity: string, id: string): string {
    return `${this.systemName}#${entity}#${id}`;
  }

  buildDynamoSystemPrefix(entity: string): string {
    return `${this.systemName}#${entity}`;
  }
}
