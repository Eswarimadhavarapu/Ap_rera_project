import "../styles/CommonStepper.css";
import { useNavigate, useLocation } from "react-router-dom";

const AgentStepper = ({ currentStep }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { label: "Agent Detail", path: "/AgentDetails" },
    { label: "Upload Documents", path: "/AgentUploadDocumentOtherthan" },
    { label: "Preview", path: "/preview-other" },
    { label: "Payment", path: "/agent-paymentpage" },
    { label: "Acknowledgement", path: "/acknowledgement" },
  ];

  return (
    <div className="common-stepper">

      {steps.map((step, i) => {

        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div
            key={i}
            className={`common-step 
              ${isCompleted ? "completed" : ""} 
              ${isActive ? "active" : ""}`}
            onClick={() => {
  // Allow only current and completed steps
  if (i <= currentStep) {
    navigate(step.path, { state: location.state });
  }
}}
            style={{
  cursor: i <= currentStep ? "pointer" : "not-allowed",
  opacity: i <= currentStep ? 1 : 0.5,
}}
          >
            <div className="circle">{i + 1}</div>
            <span>{step.label}</span>
          </div>
        );
      })}

    </div>
  );
};

export default AgentStepper;