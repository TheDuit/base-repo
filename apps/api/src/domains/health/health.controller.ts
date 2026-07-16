import { Controller, Get } from "@nestjs/common";

import { Public } from "../../auth/decorators/public.decorator";
import { SystemContextService } from "../../system/system-context.service";

@Controller("health")
export class HealthController {
  constructor(private readonly systemContext: SystemContextService) {}

  @Public()
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: `${this.systemContext.systemName}-api`,
      timestamp: new Date().toISOString()
    };
  }
}
