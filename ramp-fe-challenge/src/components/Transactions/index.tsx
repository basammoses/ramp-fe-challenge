import { useCallback, useEffect, useState } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams, Transaction } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types";

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();
  const [checkedValues, setCheckedValues] = useState<Record<string, boolean>>({});

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      });

      setCheckedValues((prevCheckedValues) => ({
        ...prevCheckedValues,
        [transactionId]: newValue,
      }));
    },
    [fetchWithoutCache]
  );

  const handleCheckboxChange = useCallback(
    (transactionId: string, newValue: boolean) => {
      setCheckedValues((prevCheckedValues) => ({
        ...prevCheckedValues,
        [transactionId]: newValue,
      }));
    },
    []
  );

  useEffect(() => {
    const savedCheckedValues = localStorage.getItem("checkedValues");
    if (savedCheckedValues) {
      setCheckedValues(JSON.parse(savedCheckedValues));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("checkedValues", JSON.stringify(checkedValues));
  }, [checkedValues]);

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
          checked={checkedValues[transaction.id] ?? false}
          onCheckboxChange={(newValue) => handleCheckboxChange(transaction.id, newValue)}
        />
      ))}
    </div>
  );
};
