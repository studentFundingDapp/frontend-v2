import { Wallet } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { fundingApi } from "../lib/api";
import DashboardAnalytics from "../components/DashboardAnalytics";
import PageWrapper from "../components/PageWrapper";
import TransactionCard from "../components/TransactionCard";
import { Button } from "../components/ui/button";
import { useLoading } from "../context/LoadingContext";
import { useToast } from "../hooks/use-toast";
import { studentApi, type FundingTransaction } from "../lib/api";

// Import your API client and types
// import { studentApi, FundingTransaction } from "../api/client"; // Adjust path if needed

// Define a type for the dashboard analytics data for type safety
interface DashboardData {
  totalFunded: string;
  pendingPayouts: string;
  availableBalance: string;
  transactionHistory: { month: string; received: number; sent: number }[];
}

export default function Index() {
  const { setLoading } = useLoading();
  const { toast } = useToast();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<FundingTransaction[]>([]);
  const [showBanner, setShowBanner] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both dashboard analytics and transaction history concurrently
      const [dashboardResponse, transactionsResponse] = await Promise.all([
        studentApi.getDashboard(),
        fundingApi.getStudentHistory({ limit: 4 }), // Fetch the 4 most recent transactions
      ]);

      if (dashboardResponse.success) {
        // NOTE: The backend's dashboard response structure needs to be known.
        // This is an assumed structure based on the mock data.
        // You MUST adjust this to match your actual API response.
        const apiData = dashboardResponse.data as any; 
        setDashboardData({
          totalFunded: apiData.totalFunded?.toLocaleString() || '0',
          pendingPayouts: apiData.pendingPayouts?.toLocaleString() || '0',
          availableBalance: apiData.availableBalance?.toLocaleString() || '0',
          transactionHistory: apiData.transactionHistory || [],
        });
      } else {
        toast({
          title: "Error",
          description: "Could not fetch dashboard analytics.",
          variant: "destructive",
        });
      }

      if (transactionsResponse.success) {
        setRecentTransactions(transactionsResponse.data);
      } else {
        toast({
          title: "Error",
          description: "Could not fetch recent transactions.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, toast]);


  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Placeholder for unimplemented features
  const showComingSoon = (action: string) => {
    toast({
      title: `${action} clicked!`,
      description: "This feature will be available soon.",
      duration: 3000,
    });
  };

  return (
    <PageWrapper>
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {showBanner && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <p className="text-sm dark:text-gray-300">
                  Welcome back! Your <span className="text-blue-600 dark:text-blue-400 font-medium">funding wallet</span> is active.
                </p>
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowBanner(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-4 md:mb-0">
              <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {dashboardData ? `${dashboardData.availableBalance} XLM` : 'Loading...'}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => showComingSoon("Withdraw funds")} className="border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                Withdraw
              </Button>
              <Button variant="outline" onClick={() => showComingSoon("Send funds")} className="border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Send
              </Button>
              <Button onClick={() => showComingSoon("Receive funds")} className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600">
                Receive
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardAnalytics
                totalFunded={dashboardData?.totalFunded || "0"}
                pendingPayouts={dashboardData?.pendingPayouts || "0"}
                availableBalance={dashboardData?.availableBalance || "0"}
                transactionHistory={dashboardData?.transactionHistory || []}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h2>
                  <Button variant="ghost" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0" onClick={() => showComingSoon("View all transactions")}>
                    View all
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <TransactionCard
                        key={tx.id}
                        // This logic assumes a convention. If you are a student,
                        // a transaction where you are the recipient is 'incoming'.
                        // You may need to adjust this based on your API data.
                        type={tx.donor_id !== "YOUR_LOGGED_IN_USER_ID" ? "incoming" : "outgoing"}
                        amount={tx.amount.toLocaleString()}
                        stellarAddress={tx.donor_id} // Or project_id, depending on context
                        timestamp={new Date(tx.timestamp).toLocaleDateString()}
                        status={"completed"} // Assuming all fetched tx are completed for now
                        memo={tx.message}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No recent transactions found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}