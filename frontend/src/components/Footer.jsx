import React from 'react'

export const Footer = () => {
  return (
    <footer className="min-w-full bg-gray-900 text-white text-center py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} ShopMate. All rights reserved.
        </p>
      </footer>
  )
}
