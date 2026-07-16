import { Global, Module } from "@nestjs/common";

import { SystemContextService } from "./system-context.service";
import { SystemManifestService } from "./system-manifest.service";

@Global()
@Module({
  providers: [SystemManifestService, SystemContextService],
  exports: [SystemManifestService, SystemContextService]
})
export class SystemModule {}
