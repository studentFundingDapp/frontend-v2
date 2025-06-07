import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

// Import your components and hooks
import PageWrapper from "../components/PageWrapper";
import DonorsList from "../components/donations/DonorsList";
import EmptyStateBlock from "../components/donations/EmptyStateBlock";
import EngagementFooter from "../components/donations/EngagementFooter";
import FundingProgressChart from "../components/donations/FundingProgressChart";
import FundingSummaryCard from "../components/donations/FundingSummaryCard";
import { useLoading } from "../context/LoadingContext";
import { useToast } from "../hooks/use-toast";

// Import your API client and types
import { studentApi, fundingApi } from "../lib/api";
import type { FundingTransaction } from "../lib/api"; // Adjust path if needed

// Interface for the data expected by the DonorsList component
export interface DonorData {
  id: string;
  avatarUrl: string; // Will use a placeholder as this isn't in the API response
  donorName: string; // Will use a placeholder
  amount: number;
  message?: string;
  donatedAt: string;
}

// Interface for the summary analytics data from the dashboard
interface DonationSummary {
  totalRaised: number;
  totalDonors: number;
  averageDonation: number;
  targetAmount: number; // Assuming target is part of the dashboard/project data
}

// Interface for the weekly chart data
interface WeeklyDonation {
    day: string;
    amount: number;
}

const DonationsPage = () => {
  const { setLoading } = useLoading();
  const { toast } = useToast();

  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [donors, setDonors] = useState<FundingTransaction[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyDonation[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardResponse, fundingHistoryResponse] = await Promise.all([
        studentApi.getDashboard(),
        fundingApi.getStudentHistory(),
      ]);

      // Process Dashboard Data for Summary and Chart
      if (dashboardResponse.success) {
        // NOTE: The structure of dashboardResponse.data is assumed.
        // You MUST adjust the property access (e.g., apiData.totalFunding)
        // to match what your actual backend API returns.
        const apiData = dashboardResponse.data as any;
        setSummary({
          totalRaised: apiData.totalRaised || 0,
          totalDonors: apiData.totalDonors || 0,
          averageDonation: apiData.averageDonation || 0,
          targetAmount: apiData.targetAmount || 5000, // Fallback target
        });
        setWeeklyData(apiData.weeklyDonations || []);
      } else {
        toast({
          title: "Error",
          description: "Could not fetch dashboard summary.",
          variant: "destructive",
        });
      }

      // Process Funding History for Donors List
      if (fundingHistoryResponse.success) {
        setDonors(fundingHistoryResponse.data);
      } else {
        toast({
          title: "Error",
          description: "Could not fetch donation history.",
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Map the raw transaction data to the format expected by the DonorsList component
  const mappedDonors: DonorData[] = donors.map(tx => ({
    id: tx.id,
    avatarUrl: "/placeholder.svg", // Placeholder, as API doesn't provide this
    donorName: `Donor #${tx.donor_id.slice(0, 6)}...`, // Anonymized donor name
    amount: tx.amount,
    message: tx.message,
    donatedAt: new Date(tx.timestamp).toLocaleDateString(),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <PageWrapper>
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100"
          variants={itemVariants}
        >
          Your Donations Dashboard
        </motion.h1>

        {donors.length > 0 && summary ? (
          <>
            <motion.div variants={itemVariants}>
              <FundingSummaryCard
                totalRaised={summary.totalRaised}
                totalDonors={summary.totalDonors}
                averageDonation={summary.averageDonation}
                targetAmount={summary.targetAmount}
              />
            </motion.div>

            <motion.div className="my-8" variants={itemVariants}>
              <FundingProgressChart
                weeklyData={weeklyData}
                targetAmount={summary.targetAmount}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Donors</h2>
              <DonorsList donors={mappedDonors} />
            </motion.div>

            <motion.div className="mt-12" variants={itemVariants}>
              <EngagementFooter />
            </motion.div>
          </>
        ) : (
          // Show empty state only after loading is complete and if there's no data
          <motion.div variants={itemVariants}>
            <EmptyStateBlock />
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default DonationsPage;