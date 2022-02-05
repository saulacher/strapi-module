import { useStrapiUrl } from "./useStrapiUrl.mjs";
import { useStrapiVersion } from "./useStrapiVersion.mjs";
import { useStrapiToken } from "./useStrapiToken.mjs";
import { useNuxtApp } from "#app";
const defaultErrors = (err) => ({
  v4: {
    error: {
      status: 500,
      name: "UnknownError",
      message: err.message,
      details: err
    }
  },
  v3: {
    error: "UnknownError",
    message: err.message,
    statusCode: 500
  }
});
export const useStrapiClient = () => {
  const nuxt = useNuxtApp();
  const baseURL = useStrapiUrl();
  const version = useStrapiVersion();
  const token = useStrapiToken();
  return async (url, fetchOptions = {}) => {
    const headers = {};
    if (token && token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    try {
      
      return await $fetch(url, {
        retry: 0,
        baseURL,
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers
        }
      });
    } catch (err) {
      const e = err.response?.data || defaultErrors(err)[version];
      nuxt.hooks.callHook("strapi:error", e);
      throw e;
    }
  };
};
