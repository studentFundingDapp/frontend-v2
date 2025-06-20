import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardAnalytics from "../components/DashboardAnalytics";
import PageWrapper from "../components/PageWrapper";
import TransactionCard from "../components/TransactionCard";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { getAccountBalance } from '../utils/stellar';
import { useAuth } from "../context/AuthContext";
import { useLoader } from "../context/LoaderContext";

export default function Index() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    showLoader("Loading Dashboard...");
    const timer = setTimeout(() => {
      hideLoader();
    }, 1000);
    return () => clearTimeout(timer);
  }, [showLoader, hideLoader]);

  useEffect(() => {
    if (user?.publicKey) {
      getAccountBalance(user.publicKey).then(setBalance);
    }
  }, [user?.publicKey]);

  const [showBanner, setShowBanner] = useState(true);

  // Mock transaction data
  const recentTransactions = [
    {
      type: "incoming" as const,
      amount: "2,500",
      stellarAddress: "GD5DJQDDBKGAYNEAXU562HYGOOSYAEOO6AS53PZXBOZGCP5M2OPGMZV3",
      timestamp: "2 days ago",
      status: "completed" as const,
      memo: "Scholarship Grant"
    },
    {
      type: "outgoing" as const,
      amount: "150",
      stellarAddress: "GAZKLL5ESQC35BOIB23CBHJLKWWVMJZAOMCLES2YXQWJGLRXHMSLDYDD",
      timestamp: "1 week ago",
      status: "completed" as const,
      memo: "Tuition Fee"
    },
    {
      type: "incoming" as const,
      amount: "800",
      stellarAddress: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
      timestamp: "2 weeks ago",
      status: "completed" as const
    },
    {
      type: "outgoing" as const,
      amount: "50",
      stellarAddress: "GDRV7QAYQMFQG5FJ2ZFCLPF7OGJWMKKKJ4DBV6TQYAG7U4IJKQLS4MJP",
      timestamp: "3 weeks ago",
      status: "pending" as const
    }
  ];

  // Mock analytics data
  const analyticsData = {
    totalFunded: "15,250",
    pendingPayouts: "2,500",
    availableBalance: "8,320",
    transactionHistory: [
      { month: "Jan", received: 1200, sent: 800 },
      { month: "Feb", received: 1800, sent: 1200 },
      { month: "Mar", received: 1500, sent: 1400 },
      { month: "Apr", received: 2200, sent: 1100 },
      { month: "May", received: 2800, sent: 1300 },
      { month: "Jun", received: 2500, sent: 1500 }
    ]
  };
  
  return (
    
    <PageWrapper>
      <div>
      <header>
     <p>Wallet: {user?.publicKey ? `${user.publicKey.slice(0, 8)}...${user.publicKey.slice(-8)}` : 'N/A'}</p>
          <p>Balance: {balance} XLM</p>
          </header>
          </div>
      
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Welcome Banner */}
        {/* <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-sm dark:text-gray-300">Welcome back! Your Stellar wallet is <span className="text-blue-600 dark:text-blue-400 font-medium">ready for transactions</span></p>
              <Button size="sm" variant="ghost" className="text-xs">Dismiss</Button>
            </div>
          </div>
        </div> */}

{/* to set the dismiss button to make the welcome message disappear */}
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Stellar Wallet</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">8,320 XLM</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => showNotification("Withdraw funds")}
                className="border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                Withdraw
              </Button>
              <Button 
                variant="outline" 
                onClick={() => showNotification("Send funds")}
                className="border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Send
              </Button>
              <Button 
                onClick={() => showNotification("Receive funds")}
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
              <DashboardAnalytics 
                totalFunded={analyticsData.totalFunded}
                pendingPayouts={analyticsData.pendingPayouts}
                availableBalance={analyticsData.availableBalance}
                transactionHistory={analyticsData.transactionHistory}
              />
            </div>
            
            {/* Right Column - Recent Transactions */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0"
                    onClick={() => showNotification("View all transactions")}
                  >
                    View all
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
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
