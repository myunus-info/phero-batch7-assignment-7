"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getParam = useCallback(
    (key: string, defaultValue = "") => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams],
  );

  const setParams = useCallback(
    (params: Record<string, string | number | undefined | null>, resetPage = false) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (resetPage) {
        current.set("page", "1");
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === "ALL") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clearParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    getParam,
    setParams,
    clearParams,
    searchParams,
    pathname,
  };
}

export default useUrlParams;
