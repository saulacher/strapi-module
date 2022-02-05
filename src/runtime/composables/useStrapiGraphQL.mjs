import { useStrapiClient } from "./useStrapiClient.mjs";
import { useRuntimeConfig } from "#app";
export const useStrapiGraphQL = () => {
  const client = useStrapiClient();
  const config = useRuntimeConfig();
  return (query) => {
    return client("/graphql", { method: "POST", body: { query }, baseURL: config.strapi.url });
  };
};
