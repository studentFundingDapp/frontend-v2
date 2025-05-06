// src/pages/Home.tsx
import { useEffect } from "react";
import Loader from "../components/Loader";
import PageWrapper from "../components/PageWrapper";
import { useLoading } from "../context/LoadingContext";

export default function Home() {
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-blue-600">Welcome to DSFS 🚀</h1>
      <p className="mt-2 text-gray-700">Decentralized Student Funding System</p>
    </PageWrapper>
  );
}
