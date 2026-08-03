import { useState } from "react";
import ScrutinitySidebar from "./ScrutinitySidebar";
import TopHeader from "./TopHeader";
import "../../styles/scrutiny/scrutinydashboard.css";
import "../../styles/scrutiny/project_scrutiny_ui.css";

export default function ScrutinyLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="scrutiny-layout">
      <ScrutinitySidebar sidebarOpen={sidebarOpen} />

     <div
        className={
          sidebarOpen
            ? "scrutiny-main scrutiny-main-open"
            : "scrutiny-main scrutiny-main-full"
        }
      >
        <TopHeader toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        {children}
      </div>
    </div>
  );
}