import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "../lib/utils";

interface TransactionProps {
  type: "incoming" | "outgoing";
  amount: string;
  stellarAddress: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  memo?: string;
}

const TransactionCard: React.FC<TransactionProps> = ({
  type,
  amount,
  stellarAddress,
  timestamp,
  status,
  memo
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={cn(
          "p-1 rounded-full", 
          type === "incoming" 
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        )}>
          {type === "incoming" ? (
            <ArrowDown className="h-5 w-5" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </div>

        <div className="flex flex-col">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {type === "incoming" ? "Received" : "Sent"} XLM
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex space-x-1 items-center">
            <span>{shortenAddress(stellarAddress)}</span>
            {memo && <span className="text-xs">({memo})</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className={cn(
          "font-medium text-xs",
          type === "incoming" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
        )}>
          {type === "incoming" ? "+" : "-"}{amount} XLM
        </p>
        <div className="flex space-x-2 text-xs items-center">
          <span className="text-gray-500 dark:text-gray-400">{timestamp}</span>
          <span className={cn(
            "px-1 py-0.5 rounded-full text-xs",
            status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "",
            status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "",
            status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : ""
          )}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function to shorten Stellar addresses for display
function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default TransactionCard;
