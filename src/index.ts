import { ApplicationController } from "./controllers/ApplicationController";

async function main() {
  const app = new ApplicationController();
  await app.start();
}

main().catch((err) => {
  console.error("Ошибка при выполнении приложения:", err);
});