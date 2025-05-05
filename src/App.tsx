import Navbar from "./components/Navbar";
import AppRoutes from "./routes";

const App = () => {
    return (
        <div>
            <Navbar />
            <AppRoutes />  {/* Make sure this is included */}
        </div>
    );
};

export default App;
