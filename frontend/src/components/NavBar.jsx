import React from 'react'
import { FaShoppingCart} from "react-icons/fa";
import { Link } from "react-router-dom";
export const NavBar = () => {
  return (
    <div>
        <header className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-4 lg:px-4 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 text-xl font-bold">
            <div className="w-10 h-10 bg-white rounded-full mx-auto flex items-center justify-center relative border">
                          <FaShoppingCart className="h-5 w-5 text-gray-900" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
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
    </div>
  )
}
