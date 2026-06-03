import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🚦</span>
            <div>
              <h3 className="gradient-text">MetaTraffic AI</h3>
              <p>Comparative Optimization of Urban Traffic Signal Timing</p>
            </div>
          </div>
          <div className="footer-info">
            <p className="footer-course">
              <span className="footer-label">Course:</span> Evolutionary
              Computing
            </p>
            <p className="footer-university">
              <span className="footer-label">University:</span> Dawood
              University of Engineering & Technology
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 MetaTraffic AI — Built with Python, React, and comparative
            optimization
          </p>
        </div>
      </div>
    </footer>
  );
}
