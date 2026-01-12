import { useEffect, useState } from "react";
import "../styles/AnnouncementPopup.css";

// IMAGE
import announcementImg from "../../public/assets/images/apreraad_new1.jpg";

const announcements = [
  {
    title: "Circular No. P/18/2025 Dt.29-12-2025",
    description:
      "One Time Opportunity with 50% Concession on Late Fee for Un-registered Projects.",
  },
  {
    title: "Quarterly Updates Status Report",
    description:
      "APRERA Registered Projects - Quarterly Updates Status Report (By order of the Authority)",
  },
  {
    title: "Circular No. P/10/2025, Dt.14-05-2025",
    description:
      "AP RERA - Change Request (CR) - Levy of Fee - Circular Issued - Reg.",
  },
  {
    title: "Circular No. P/9/2025 Dt.28-03-2025",
    description:
      "AP RERA - Pending QPRs - Imposition of Penalty for delayed submission.",
  },
  {
    title: "Circular No. P/8/2025 Dt.28-03-2025",
    description:
      "AP RERA - Directions for Maintenance and Operation of Real Estate Project Bank Accounts - Reg.",
  },
];

const AnnouncementPopup = () => {
  // 1 = Image popup, 2 = Announcement popup, 0 = closed
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(1);
  }, []);

  if (step === 0) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* HEADER */}
        <div className="popup-header">
          <span>ANNOUNCEMENTS</span>
          <button
            onClick={() => {
              if (step === 1) setStep(2);
              else setStep(0);
            }}
          >
            ×
          </button>
        </div>

        {/* =====================
            POPUP 1 – IMAGE ONLY
        ====================== */}
        {step === 1 && (
          <div className="popup-body image-only">
            <img src={announcementImg} alt="APRERA Circular" />
          </div>
        )}

        {/* =========================
            POPUP 2 – ANNOUNCEMENTS
        ========================== */}
        {step === 2 && (
          <div className="popup-body announcement-list">
            {announcements.map((item, index) => (
              <div key={index} className="announcement-card">
                <div className="announcement-title">
                  <span className="new-badge">NEW</span>
                  {item.title}
                  <span className="new-badge">NEW</span>
                </div>
                <p>
                  <b>{item.description}</b>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementPopup;