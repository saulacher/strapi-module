import { useCookie, useNuxtApp } from "#app";
export const useStrapiTokenRefresh = () => {
  const nuxtApp = useNuxtApp();
  nuxtApp._cookies = nuxtApp._cookies || {};
  if (nuxtApp._cookies.strapi_refresh) {
    return nuxtApp._cookies.strapi_refresh;
  }
  const cookie = useCookie("strapi_refresh");
  nuxtApp._cookies.strapi_refresh = cookie;
  return cookie;
};
