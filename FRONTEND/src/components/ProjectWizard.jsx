import { useNavigate } from "react-router-dom";
import { WIZARD_STEPS } from "./wizardConfig";
import "../styles/projectWizard.css";

export default function ProjectWizard({ currentStep }) {
  const navigate = useNavigate();

  const completedSteps =
    JSON.parse(localStorage.getItem("completedSteps")) || [];

  return (
    <div className="WIZARDDIV">
      <div className="stepper">
        {WIZARD_STEPS.map(step => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`step-item ${
                isCompleted ? "completed" : ""
              } ${isActive ? "active" : ""}`}
              onClick={() => {
                if (isCompleted || isActive) {
                  navigate(step.path);
                }
              }}
            >
              <div className="step-circle">{step.id}</div>
              <div className="step-label">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}