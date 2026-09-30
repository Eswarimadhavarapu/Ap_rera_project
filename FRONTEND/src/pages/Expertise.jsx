import "../styles/cards.css";

export default function Expertise() {
  return (
    <section className="expertise">
      <h2 className="expertise-section-title">
        OUR SERVICES
      </h2>

      <div className="expertise-title-line"></div>

      <p className="expertise-section-subtitle">
        Jhasina Technologies Pvt. Ltd. provides technology-driven
        solutions designed to simplify and streamline real-estate
        business operations.
      </p>

      <div className="expertise-grid">

        {/* 1. REAL ESTATE SOFTWARE SOLUTIONS */}
        <div className="expertise-card">
          <div className="expertise-icon">🏢</div>

          <h3>REAL ESTATE SOFTWARE SOLUTIONS</h3>

          <p>
            We develop user-friendly digital platforms that help
            real-estate businesses manage properties, projects,
            customers, and business operations efficiently.
          </p>
        </div>

        {/* 2. PROPERTY MANAGEMENT */}
        <div className="expertise-card">
          <div className="expertise-icon">🏠</div>

          <h3>PROPERTY MANAGEMENT</h3>

          <p>
            Our solutions help organizations manage property details,
            project information, documents, and related activities
            through a centralized digital platform.
          </p>
        </div>

        {/* 3. PROJECT MANAGEMENT */}
        <div className="expertise-card">
          <div className="expertise-icon">📊</div>

          <h3>PROJECT MANAGEMENT</h3>

          <p>
            We provide digital tools for managing real-estate projects,
            tracking project activities, maintaining records, and
            improving operational visibility.
          </p>
        </div>

        {/* 4. DIGITAL PROPERTY SERVICES */}
        <div className="expertise-card">
          <div className="expertise-icon">💻</div>

          <h3>DIGITAL PROPERTY SERVICES</h3>

          <p>
            We transform traditional property processes into
            convenient digital experiences, making real-estate
            information and services easier to access and manage.
          </p>
        </div>

        {/* 5. DOCUMENT MANAGEMENT */}
        <div className="expertise-card">
          <div className="expertise-icon">📄</div>

          <h3>DOCUMENT MANAGEMENT</h3>

          <p>
            Our platforms help organize, manage, and access
            property-related documents and records while improving
            efficiency and reducing manual processes.
          </p>
        </div>

        {/* 6. CUSTOMER & BUSINESS SUPPORT */}
        <div className="expertise-card">
          <div className="expertise-icon">🤝</div>

          <h3>CUSTOMER &amp; BUSINESS SUPPORT</h3>

          <p>
            We build digital solutions that help real-estate
            businesses serve customers efficiently and manage
            day-to-day business activities through technology.
          </p>
        </div>

      </div>
    </section>
  );
}