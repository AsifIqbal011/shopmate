import { Link } from "react-router-dom";
import { FaReceipt, FaChartLine } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
    <header className="fixed top-0 left-0 w-screen bg-gray-900 text-white z-50">
  <div className="flex justify-between items-center px-6 py-4">
     {/* Logo */}
    <div className="flex items-center gap-2 text-xl font-bold">
      <span className="text-2xl text-orange-500">🛒</span>
      <span>ShopMate</span>
    </div>

    {/* Navigation */}
    <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold">
      <Link to="/" className="hover:text-gray-300 text-white">Home</Link>
      <Link to="/docs" className="hover:text-gray-300 text-white">Doc</Link>
      <Link to="/contact" className="hover:text-gray-300 text-white">Contact</Link>
      <Link to="/signup" className="hover:text-gray-300 text-white">Signup</Link>
      <Link to="/login" className="hover:text-gray-300 text-white">Login</Link>
    </nav>
  </div>
</header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center  bg-white w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mt-15 mb-4">Welcome</h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-xl">
          Let’s simplify your sales, costs, and profit tracking
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link to="/signup">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium w-full sm:w-auto">
              Sign up
            </button>
          </Link>
          <Link to="/learn-more">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium w-full sm:w-auto">
              Learn More
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-6xl mt-5 px-18">
          <div className="flex flex-col items-center">
            <FaReceipt className="text-4xl text-black" />
            <p className="mt-3 text-blue-700 font-semibold">Generate Bills</p>
          </div>
          <div className="flex flex-col items-center">
            <FaChartLine className="text-4xl text-yellow-500" />
            <p className="mt-3 text-blue-700 font-semibold">Calculate Profit</p>
          </div>
          <div className="flex flex-col items-center">
            <MdAnalytics className="text-4xl text-blue-500" />
            <p className="mt-3 text-blue-700 font-semibold">Analyze Sales</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-screen bg-gray-900 text-white text-center py-4 mt-auto">
        <p className="text-sm">© {new Date().getFullYear()} ShopMate. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
