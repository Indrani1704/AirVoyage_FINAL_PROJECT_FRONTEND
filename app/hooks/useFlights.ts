"use client";

import {
  useQuery,
} from "@tanstack/react-query";

type Params = {
  [key: string]:
    string | number | boolean;
};

export const useFlights = (
  params?: Params
) => {

  return useQuery({

    queryKey: [
      "flights",
      params,
    ],

    queryFn:
      async () => {

        const query =
          params
            ? `?${new URLSearchParams(
                Object.entries(
                  params
                ).reduce(
                  (
                    acc,
                    [key, value]
                  ) => {

                    acc[key] =
                      String(
                        value
                      );

                    return acc;

                  },
                  {} as Record<
                    string,
                    string
                  >
                )
              ).toString()}`
            : "";

        const res =
          await fetch(
            `https://airvoyage-final-project-backend-2.onrender.com/api/flights${query}`
          );

        if (!res.ok) {

          throw new Error(
            "Failed to fetch flights"
          );

        }

        const data =
          await res.json();

        return data;

      },

  });

};