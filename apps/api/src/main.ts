import { createNestApplication } from "./server";

async function bootstrap() {
  const app = await createNestApplication();
  const port = Number(process.env.PORT ?? 4000);

  await app.listen(port, "0.0.0.0");
}

void bootstrap();
