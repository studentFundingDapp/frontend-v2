// src/App.tsx
import { Route, Routes } from "react-router-dom";
import { useLoading } from "./context/LoadingContext";

// Import pages
import Home from "./pages/Home";

// Import components
import Footer from "./components/Footer";
// import Loader from "./components/Loader";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  const { loading } = useLoading(); // Access loading state

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show Loader when loading */}
      {/* loading && <Loader /> */}

      {/* NavBar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
