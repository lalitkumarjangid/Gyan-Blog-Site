
function Footer() {
    return (
      <footer className="bg-black text-white py-4 text-center">
        <p>&copy; 2025 Gyan Blog. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </a>
          <span>|</span>
          <a
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </a>
          <span>|</span>
          <a
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    );
  }

export default Footer