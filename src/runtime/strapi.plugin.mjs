import { useStrapiAuth } from "./composables/useStrapiAuth.mjs";
import { defineNuxtPlugin } from "#app";
export default defineNuxtPlugin(async () => {
  const { fetchUser } = useStrapiAuth();
  await fetchUser();
});
