import { redirect } from "next/navigation";
import { statsRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import AIModelsClient from "./client";

export default async function AIModelsPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const models = await statsRepo.listModelConfigs(token);

  return <AIModelsClient initialData={models} />;
}
