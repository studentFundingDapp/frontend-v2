import { useEffect } from "react";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import PageWrapper from "../components/PageWrapper";
import { useLoading } from "../context/LoadingContext";
import TransactionCard from "../components/TransactionCard";
import DashboardAnalytics2 from "../components/dashboardAnalytics2";

export default function Donate() {
  const { setLoading } = useLoading();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLoading]);

  const showNotification = (action: string) => {
    toast({
      title: `${action} clicked!`,
      description: "This feature will be available soon.",
      duration: 3000,
    });
  };

  const donationTransactions = [
    {
      type: "incoming" as const,
      amount: "5,000",
      stellarAddress: "GD6DUMMYDONORADDRESS1111111111111111",
      timestamp: "1 day ago",
      status: "completed" as const,
      memo: "Church Donation"
    },
    {
      type: "outgoing" as const,
      amount: "1,000",
      stellarAddress: "GAOUTREACHBENEFICIARYADDRESS222222",
      timestamp: "3 days ago",
      status: "completed" as const,
      memo: "Outreach Expenses"
    },
    {
      type: "incoming" as const,
      amount: "3,200",
      stellarAddress: "GCCOMMUNITYDONORADDRESS3333333",
      timestamp: "1 week ago",
      status: "completed" as const
    },
    {
      type: "outgoing" as const,
      amount: "500",
      stellarAddress: "GASTUDENTSUPPORTADDRESS444444",
      timestamp: "2 weeks ago",
      status: "pending" as const
    }
  ];


  const donationAnalytics2 = {
    totalFunding: "24,500",
    availableBalance: "15,000",
    transactionHistory: [
      { month: "Jan", received: 4000, sent: 1500 },
      { month: "Feb", received: 3800, sent: 2200 },
      { month: "Mar", received: 4200, sent: 1800 },
      { month: "Apr", received: 4600, sent: 1600 },
      { month: "May", received: 5900, sent: 1700 },
      { month: "Jun", received: 6000, sent: 1900 }
    ]
  };

  const [showBanner, setShowBanner] = useState(true);
  
  return (
    <PageWrapper>
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        
        {showBanner && (
  <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <p className="text-sm dark:text-gray-300">
          Welcome back! Your <span className="text-blue-600 dark:text-blue-400 font-medium">donation wallet</span> is active.
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs"
          onClick={() => setShowBanner(false)}
        >
          Dismiss
        </Button>
      </div>
    </div>
  </div>
)}


        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Wallet Stats */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-4 md:mb-0">
              <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Donation Wallet</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">15,000 XLM</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => showNotification("Withdraw donation")}
                className="border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                Withdraw
              </Button>
              <Button 
                variant="outline" 
                onClick={() => showNotification("Send donation")}
                className="border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Send
              </Button>
              <Button 
                onClick={() => showNotification("Receive donation")}
                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Receive
              </Button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Analytics */}
            <div className="lg:col-span-2">
              <DashboardAnalytics2 
                totalFunding={donationAnalytics2.totalFunding}
                availableBalance={donationAnalytics2.availableBalance}
                transactionHistory={donationAnalytics2.transactionHistory}
              />
            </div>

            {/* Right Column - Recent Transactions */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Donations</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0"
                    onClick={() => showNotification("View all donations")}
                  >
                    View all
                  </Button>
                </div>

                <div className="space-y-4">
                  {donationTransactions.map((transaction, index) => (
                    <TransactionCard
                      key={index}
                      type={transaction.type}
                      amount={transaction.amount}
                      stellarAddress={transaction.stellarAddress}
                      timestamp={transaction.timestamp}
                      status={transaction.status}
                      memo={transaction.memo}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

  