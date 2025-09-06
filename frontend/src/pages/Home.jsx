import { Link } from "react-router-dom";
import { FaReceipt, FaChartLine } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl text-orange-500">🛒</span>
            <span>ShopMate</span>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold">
            <Link to="/" className="text-white hover:text-blue-400">
              Home
            </Link>
            <Link to="/docs" className="text-white hover:text-blue-400">
              Docs
            </Link>
            <Link to="/contact" className="text-white hover:text-blue-400">
              Contact
            </Link>
            <Link to="/signup" className="text-white hover:text-blue-400">
              Signup
            </Link>
            <Link to="/login" className="text-white hover:text-blue-400">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center bg-white w-full  pt-28 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 mt-6">
          Welcome
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-xl">
          Let’s simplify your sales, costs, and profit tracking
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
          <Link to="/signup">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-medium w-full sm:w-auto">
              Sign Up
            </button>
          </Link>
          <Link to="/learn-more">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded font-medium w-full sm:w-auto">
              Learn More
            </button>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 flex items-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <FaReceipt className="text-5xl text-black" />
            <p className="mt-4 text-blue-700 font-semibold text-lg">
              Generate Bills
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaChartLine className="text-5xl text-yellow-500" />
            <p className="mt-4 text-blue-700 font-semibold text-lg">
              Calculate Profit
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <MdAnalytics className="text-5xl text-blue-500" />
            <p className="mt-4 text-blue-700 font-semibold text-lg">
              Analyze Sales
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why choose ShopMate?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of businesses that trust ShopMate to manage their
              sales, inventory, and team performance.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-indigo-100 rounded-2xl p-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Monthly Revenue</h3>
                <span className="text-green-600 text-sm">+12.5%</span>
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                $24,500
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-indigo-600 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and see the difference ShopMate can make
          </p>
          <Link to="/signup">
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition">
              Start Free Trial
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white text-center py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} ShopMate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
