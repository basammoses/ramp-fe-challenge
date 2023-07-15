import { useCallback, useState } from "react";
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[] | null>>(null);

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions?.nextPage ?? 0,
      }
    );

    setPaginatedTransactions((previousResponse) => {
      if (previousResponse === null) {
        return response;
      } else {
        const newData = response.data.filter((newTransaction) =>
          !previousResponse.data.some((prevTransaction) => prevTransaction.id === newTransaction.id)
        );

        return {
          data: [...previousResponse.data, ...newData],
          nextPage: response.nextPage,
        };
      }
    });
  }, [fetchWithCache, paginatedTransactions]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData };
}
