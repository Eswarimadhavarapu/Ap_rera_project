import { useNavigate } from "react-router-dom";
import { WIZARD_STEPS } from "./wizardConfig";
import "../styles/projectWizard.css";

export default function ProjectWizard({ currentStep }) {
  const navigate = useNavigate();

  return (
    <div className="projwizard-WIZARDDIV">
      <div className="projwizard-stepper">
        {WIZARD_STEPS.map((step) => {
          // ✅ completed = steps BEFORE currentStep
          const isCompleted = step.id < currentStep;

          // ✅ active = current step only
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`projwizard-step-item ${
                isCompleted ? "projwizard-completed" : ""
              } ${isActive ? "projwizard-active" : ""}`}
              onClick={() => {
                // Allow navigation only to completed or active steps
                if (isCompleted || isActive) {
                  navigate(step.path);
                }
              }}
            >
              <div className="projwizard-step-circle">{step.id}</div>
              <div className="projwizard-step-label">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
