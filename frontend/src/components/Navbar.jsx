// frontend/src/components/Navbar.jsx
import { useState } from 'react';
import GraphModal from './GraphModal';
import './Navbar.css';

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="navbar-logo">CourtroomAI</span>
          <span className="navbar-badge">Multi-Agent v1.0</span>
        </div>
        <div className="navbar-right">
          
          {/* Fixed Line Below: Added missing '<a' */}
          <a 
            href="#"
            className="navbar-link"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
          >
            Graph Architecture
          </a>
          
          <span className="navbar-divider">|</span>
          
          {/* Fixed Line Below: Added missing '<a' */}
          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            GitHub
          </a>
        </div>
      </nav>

      {isModalOpen && <GraphModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default Navbar;