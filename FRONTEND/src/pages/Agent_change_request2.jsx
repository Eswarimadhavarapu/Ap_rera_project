import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AgentChangeRequestForm.css";
import { apiGet, apiPost } from "../api/api";
import AgentChangeRequestStepper from "../components/agent_changerequest_steper";

const SECTION_FIELDS = {
  individual: {
    "Application Details": [
      "Agent Name",
      "Photograph",
      "Father Name",
      "Occupation",
      "Email",
      "Aadhaar Number",
      "PAN Card",
      "PAN Card Proof",
      "Mobile Number",
      "Landline Number",
      "Registration Number / License Number",
      "Registration Date"
    ],
    "Local Address": [
      "Address Line 1",
      "Address Line 2",
      "State",
      "District",
      "Mandal",
      "Local Area / Village",
      "PIN Code",
      "Address Proof"
    ],
    // "Project Launch": ["Last Five Years Project Details", "Project Name"],
    // Litigations: ["Any Civil/Criminal Cases"],
    // "Other State/UT RERA Registration Details": [
    //   "Do You Have Registration In Other States",
    //   "Registration Number",
    //   "State / UT",
    //   "District"
    // ]
  },
  organization: {
    "Authorized Signatory Details": [
      "Authorized Signatory Name",
      "Authorized Signatory Designation",
      "Authorized Signatory Mobile Number",
      "Authorized Signatory Email",
      "Authorized Signatory ID Proof"
    ],
    // "Project Launch": ["Last five years project details", "Project Name"],
    // Litigations: [
    //   "Any Civil/Criminal Cases",
    //   "Self Declared Affidavit",
    //   "Case No",
    //   "Name & Place of Tribunal/Authority",
    //   "Name of the Petitioner",
    //   "Name of the Respondent",
    //   "Facts of the Case/Contents of the Case",
    //   "Present Status of the case",
    //   "Interim Order if any",
    //   "Details of final order if disposed",
    //   "Interim Order Certificate",
    //   "Disposed Certificate"
    // ],
    // "Other State/UT RERA Registration Details": [
    //   "Do you have registration in other states",
    //   "Registration Number",
    //   "State / UT",
    //   "District"
    // ],
    "Organization Details": [
      "Organization Name",
      "Organization Type",
      "Registration Number",
      "PAN Number",
      "GST Number",
      "Email",
      "Mobile Number"
    ],
    "Local Address": [
      "Address Line 1",
      "Address Line 2",
      "State",
      "District",
      "Mandal",
      "Local Area / Village",
      "PIN Code",
      "Address Proof"
    ]
  }
};

const FIELD_KEY_MAP = {
  "Agent Name": ["agentName", "agent_name"],
  Photograph: ["photograph"],
  "Father Name": ["fatherName", "father_name"],
  Occupation: ["occupationName", "occupation_name", "occupation"],
  Email: ["email"],
  "Aadhaar Number": ["aadhaar", "aadhaar_number"],
  "PAN Card": ["pan", "pan_number"],
  "PAN Card Proof": ["panProof", "pan_proof"],
  "Mobile Number": ["mobile"],
  "Landline Number": ["landline"],
  "Registration Number / License Number": [
    "licenseNumber",
    "license_number",
    "regNumber",
    "registration_number"
  ],
  "Registration Date": [
    "licenseDate",
    "license_date",
    "regDate",
    "registration_date"
  ],
  "Address Line 1": ["address1", "address_line_1"],
  "Address Line 2": ["address2", "address_line_2"],
  State: ["state", "stateName", "state_name"],
  District: ["district", "districtName", "district_name"],
  Mandal: ["mandal", "mandalName", "mandal_name"],
  "Local Area / Village": [
    "village",
    "villageName",
    "village_name",
    "localArea"
  ],
  "PIN Code": ["pincode", "pin", "pin_code"],
  "Address Proof": ["addressProof", "address_proof"],
  "Last Five Years Project Details": [
    "lastFiveYearsProjectDetails",
    "last_five_years_project_details"
  ],
  "Project Name": ["projectName", "project_name"],
  "Any Civil/Criminal Cases": [
    "litigationStatus",
    "anyCivilCriminalCases",
    "any_civil_criminal_cases"
  ],
  "Do You Have Registration In Other States": [
    "otherStateReg",
    "registrationOtherStates",
    "registration_other_states"
  ],
  "Registration Number": [
    "registrationNumber",
    "registration_number",
    "regNo",
    "reg_no"
  ],
  "State / UT": ["otherStateName", "other_state_name", "stateName"],
  "Organization Name": ["orgName", "organizationName", "organization_name"],
  "Organization Type": ["orgType", "organizationType", "organization_type"],
  "PAN Number": ["pan", "pan_number"],
  "GST Number": ["gst", "gst_number"],
  "Authorized Signatory Name": [
    "signName",
    "authorizedSignatoryName",
    "authorized_signatory_name"
  ],
  "Authorized Signatory Designation": [
    "signDesignation",
    "authorizedSignatoryDesignation",
    "authorized_signatory_designation"
  ],
  "Authorized Signatory Mobile Number": [
    "signMobile",
    "authorizedSignatoryMobile",
    "authorized_signatory_mobile"
  ],
  "Authorized Signatory Email": [
    "signEmail",
    "authorizedSignatoryEmail",
    "authorized_signatory_email"
  ]
};

const fileAccept = ".png,.jpg,.jpeg,.pdf,.docx";
const createFieldKey = (issue, label) => `${issue}|||${label}`;
const parseFieldKey = (fieldKey) => {
  const [issue = "", label = ""] = fieldKey.split("|||");
  return { issue, label };
};
const getIssueNames = (type) => Object.keys(SECTION_FIELDS[type] || {});
const normalizeApplicationDetails = (rawData) => {
  if (!rawData || typeof rawData !== "object") {
    return null;
  }

  if (rawData.agent_details) {
    return {
      agent_details: rawData.agent_details || {},
      projects: rawData.projects || [],
      litigations: rawData.litigations || [],
      other_state_rera: rawData.other_state_rera || []
    };
  }

  return {
    agent_details: rawData,
    projects: rawData.projects || [],
    litigations: rawData.litigations || [],
    other_state_rera: rawData.other_state_rera || []
  };
};

const determineApplicantType = (agentTypeValue) => {
  const rawValue = (agentTypeValue || "").toString().trim().toLowerCase();
  if (!rawValue) {
    return "individual";
  }
  if (rawValue.includes("other")) {
    return "other-than-individual";
  }
  if (rawValue.includes("individual")) {
    return "individual";
  }
  return "individual";
};

function ChangeRequestForm() {
  const navigate = useNavigate();

  const [panNumber, setPanNumber] = useState("");
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [isLoadingApplicationDetails, setIsLoadingApplicationDetails] = useState(false);
  const [agentInfo, setAgentInfo] = useState({});
  const [formData, setFormData] = useState({
    applicationNo: "",
    applicantType: "",
    individualIssueType: "",
    individualIssues: [],
    individualSelectedFields: [],
    individualFieldChanges: {},
    individualFieldDocuments: {},
    individualChangeDocument: "",
    individualReplaceReason: "",
    individualReplacementFile: null,
    organizationIssueType: "",
    organizationIssues: [],
    organizationSelectedFields: [],
    organizationFieldChanges: {},
    organizationFieldDocuments: {},
    organizationChangeDocument: "",
    organizationReplaceReason: "",
    organizationReplacementFile: null
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolveSpecialCurrentValue = (details, issue, label) => {
    const agentDetails = details?.agent_details || {};
    const projects = details?.projects || [];
    const litigations = details?.litigations || [];
    const otherStates = details?.other_state_rera || [];

    if (issue === "Project Launch") {
      if (label === "Project Name") {
        return projects.map((project) => project.project_name).filter(Boolean).join(", ");
      }

      if (label === "Last Five Years Project Details") {
        if (agentDetails.last_five_years_project_details !== undefined && agentDetails.last_five_years_project_details !== null) {
          return String(agentDetails.last_five_years_project_details);
        }
        return projects.length > 0 ? "Yes" : "No";
      }
    }

    if (issue === "Litigations") {
      if (label === "Any Civil/Criminal Cases") {
        if (agentDetails.any_civil_criminal_cases !== undefined && agentDetails.any_civil_criminal_cases !== null) {
          return String(agentDetails.any_civil_criminal_cases);
        }
        return litigations.length > 0 ? "Yes" : "No";
      }
    }

    if (issue === "Other State/UT RERA Registration Details") {
      const firstOtherState = otherStates[0] || {};

      if (
        label === "Do You Have Registration In Other States" ||
        label === "Do you have registration in other states"
      ) {
        if (agentDetails.registration_other_states !== undefined && agentDetails.registration_other_states !== null) {
          return String(agentDetails.registration_other_states);
        }
        return otherStates.length > 0 ? "Yes" : "No";
      }

      if (label === "Registration Number") {
        return firstOtherState.registration_number || "";
      }

      if (label === "State / UT") {
        return firstOtherState.state_name || "";
      }

      if (label === "District") {
        return firstOtherState.district || "";
      }
    }

    return "";
  };

  const resolveCurrentFieldValue = (type, issue, label) => {
    const details = applicationDetails || {};
    const merged = details.agent_details || {};
    const mappedKeys = FIELD_KEY_MAP[label] || [];

    for (const key of mappedKeys) {
      if (merged[key] !== undefined && merged[key] !== null) {
        return String(merged[key]);
      }
    }

    if (
      merged[label.toLowerCase()] !== undefined &&
      merged[label.toLowerCase()] !== null
    ) {
      return String(merged[label.toLowerCase()]);
    }

    const specialValue = resolveSpecialCurrentValue(details, issue, label);
    if (specialValue) {
      return specialValue;
    }

    return "";
  };

  // useEffect(() => {
  //   const storedPan = sessionStorage.getItem("agent_pan");

  //   if (storedPan) {
  //     setPanNumber(storedPan);

  //     const loadApplications = async (pan) => {
  //       try {
  //         const res = await apiPost("/api/change-request/get-applications", {
  //           panNumber: pan
  //         });

  //         if (Array.isArray(res?.applications)) {
  //           setApplicationOptions(
  //             res.applications
  //               .map((item) => item.application_no)
  //               .filter(Boolean)
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Application fetch error:", error);
  //       }
  //     };

  //     loadApplications(storedPan);
  //   }
  // }, []); 

useEffect(() => {
  const storedPan = sessionStorage.getItem("agent_pan");

  if (storedPan) {
    setPanNumber(storedPan);

      const loadAgentData = async () => {
        try {

          // get applications
          const res = await apiPost(
            "/api/change-request/get-applications",
            { panNumber: storedPan }
          );

        const applications = Array.isArray(res?.applications)
          ? res.applications
              .map((item) => item.application_no)
              .filter(Boolean)
          : [];

        setApplicationOptions(applications);
        if (applications.length > 0) {
          setFormData((prev) => {
            if (prev.applicationNo) {
              return prev;
            }
            return {
              ...prev,
              applicationNo: applications[0]
            };
          });
        }

          // get agent details
          const info = await apiPost(
            "/api/change-request/get-agent-info",
            { panNumber: storedPan }
          );

        console.log("AGENT INFO =", info);

        setAgentInfo(info?.data || info);

      } catch (error) {
        console.error(error);
      }
    };

    loadAgentData();
  }
}, []);


  useEffect(() => {
    const loadApplicationDetails = async () => {
      if (!formData.applicationNo) {
        setApplicationDetails(null);
        return;
      }

      try {
        setIsLoadingApplicationDetails(true);
        const res = await apiGet(
          `/api/change-request/get-application-details/${encodeURIComponent(
            formData.applicationNo
          )}`
        );
        setApplicationDetails(normalizeApplicationDetails(res?.data));
      } catch (error) {
        console.error("Application details fetch error:", error);
        setApplicationDetails(null);
      } finally {
        setIsLoadingApplicationDetails(false);
      }
    };

    loadApplicationDetails();
  }, [formData.applicationNo]);

  useEffect(() => {
    const agentDetailsSource = applicationDetails?.agent_details;
    const hasAgentType =
      agentInfo &&
      Object.prototype.hasOwnProperty.call(agentInfo, "agent_type");
    const agentInfoFallback = hasAgentType ? agentInfo : null;
    const source = agentDetailsSource || agentInfoFallback;

    if (!source) {
      return;
    }

    const applicantType = determineApplicantType(source.agent_type);

    setFormData((prev) => {
      if (prev.applicantType) {
        return prev;
      }

      return {
        ...prev,
        applicantType
      };
    });
  }, [applicationDetails, agentInfo]);

  const individualIssueTypeOptions = [
    { value: "agent-details-mistake", label: "Agent Details Mistake" },
    { value: "upload-documents-mistake", label: "Upload Documents Mistake" }
  ];

  const individualDocumentOptions = [
    "Income tax returns Acknowledgement year1",
    "Income tax returns Acknowledgement year2",
    "Income tax returns Acknowledgement year3"
  ];

  const organizationIssueTypeOptions = [
    {
      value: "change-organization-details",
      label: "Change Organization Details"
    },
    { value: "upload-document-change", label: "Upload Document Change" }
  ];

  const organizationDocumentOptions = [
    "Income tax returns Acknowledgement year1",
    "Income tax returns Acknowledgement year2",
    "Income tax returns Acknowledgement year3"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "applicantType") {
        return {
          ...prev,
          applicantType: value,
          individualIssueType: "",
          individualIssues: [],
          individualSelectedFields: [],
          individualFieldChanges: {},
          individualFieldDocuments: {},
          individualChangeDocument: "",
          individualReplaceReason: "",
          individualReplacementFile: null,
          organizationIssueType: "",
          organizationIssues: [],
          organizationSelectedFields: [],
          organizationFieldChanges: {},
          organizationFieldDocuments: {},
          organizationChangeDocument: "",
          organizationReplaceReason: "",
          organizationReplacementFile: null
        };
      }

      if (name === "individualIssueType") {
        return {
          ...prev,
          individualIssueType: value,
          individualIssues: [],
          individualSelectedFields: [],
          individualFieldChanges: {},
          individualFieldDocuments: {},
          individualChangeDocument: "",
          individualReplaceReason: "",
          individualReplacementFile: null
        };
      }

      if (name === "organizationIssueType") {
        return {
          ...prev,
          organizationIssueType: value,
          organizationIssues: [],
          organizationSelectedFields: [],
          organizationFieldChanges: {},
          organizationFieldDocuments: {},
          organizationChangeDocument: "",
          organizationReplaceReason: "",
          organizationReplacementFile: null
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleFileChange = (name) => (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      [name]: file
    }));
  };

  const handleIssueToggle = (type, issue) => {
    const issuesKey = type === "individual" ? "individualIssues" : "organizationIssues";
    const selectedFieldsKey =
      type === "individual" ? "individualSelectedFields" : "organizationSelectedFields";
    const changesKey =
      type === "individual" ? "individualFieldChanges" : "organizationFieldChanges";
    const documentsKey =
      type === "individual" ? "individualFieldDocuments" : "organizationFieldDocuments";

    setFormData((prev) => {
      const existingIssues = prev[issuesKey] || [];
      const isSelected = existingIssues.includes(issue);

      if (!isSelected) {
        return {
          ...prev,
          [issuesKey]: [...existingIssues, issue]
        };
      }

      const updatedSelectedFields = (prev[selectedFieldsKey] || []).filter(
        (fieldKey) => parseFieldKey(fieldKey).issue !== issue
      );
      const updatedChanges = { ...(prev[changesKey] || {}) };
      const updatedDocuments = { ...(prev[documentsKey] || {}) };

      Object.keys(updatedChanges).forEach((fieldKey) => {
        if (parseFieldKey(fieldKey).issue === issue) {
          delete updatedChanges[fieldKey];
        }
      });

      Object.keys(updatedDocuments).forEach((fieldKey) => {
        if (parseFieldKey(fieldKey).issue === issue) {
          delete updatedDocuments[fieldKey];
        }
      });

      return {
        ...prev,
        [issuesKey]: existingIssues.filter((item) => item !== issue),
        [selectedFieldsKey]: updatedSelectedFields,
        [changesKey]: updatedChanges,
        [documentsKey]: updatedDocuments
      };
    });
  };

  const handleLabelToggle = (type, issue, label) => {
    const selectedKey =
      type === "individual" ? "individualSelectedFields" : "organizationSelectedFields";
    const valuesKey =
      type === "individual" ? "individualFieldChanges" : "organizationFieldChanges";
    const documentsKey =
      type === "individual" ? "individualFieldDocuments" : "organizationFieldDocuments";
    const fieldKey = createFieldKey(issue, label);

    setFormData((prev) => {
      const selectedFields = prev[selectedKey] || [];
      const alreadySelected = selectedFields.includes(fieldKey);

      if (alreadySelected) {
        const updatedValues = { ...(prev[valuesKey] || {}) };
        const updatedDocuments = { ...(prev[documentsKey] || {}) };
        delete updatedValues[fieldKey];
        delete updatedDocuments[fieldKey];

        return {
          ...prev,
          [selectedKey]: selectedFields.filter((item) => item !== fieldKey),
          [valuesKey]: updatedValues,
          [documentsKey]: updatedDocuments
        };
      }

      return {
        ...prev,
        [selectedKey]: [...selectedFields, fieldKey]
      };
    });
  };

  const handleFieldChangeValue = (type, issue, label, value) => {
    const valuesKey =
      type === "individual" ? "individualFieldChanges" : "organizationFieldChanges";
    const fieldKey = createFieldKey(issue, label);

    setFormData((prev) => ({
      ...prev,
      [valuesKey]: {
        ...(prev[valuesKey] || {}),
        [fieldKey]: value
      }
    }));
  };

  const handleFieldDocumentChange = (type, issue, label) => (e) => {
    const documentsKey =
      type === "individual" ? "individualFieldDocuments" : "organizationFieldDocuments";
    const fieldKey = createFieldKey(issue, label);
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      [documentsKey]: {
        ...(prev[documentsKey] || {}),
        [fieldKey]: file
      }
    }));
  };

  const renderCurrentValueControl = (value, fieldId) => {
    const currentValue = value || "";
    if (currentValue.length > 80) {
      return <textarea id={fieldId} value={currentValue} readOnly rows={3} />;
    }
    return <input id={fieldId} type="text" value={currentValue} readOnly />;
  };

  const renderIssueSelector = (type, selectedIssues) => {
    const issues = getIssueNames(type);

    return (
      <div className="issue-selector">
        <p className="field-change-title">Select Issue Sections</p>
        <div className="field-change-list issue-checkbox-list">
          {issues.map((issue) => (
            <label key={issue} className="field-change-item">
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue)}
                onChange={() => handleIssueToggle(type, issue)}
              />
              <span className="field-label-name">{issue}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderFieldChangeBuilder = (type, selectedIssues) => {
    if (!selectedIssues.length) {
      return null;
    }

    const selectedFields =
      type === "individual"
        ? formData.individualSelectedFields
        : formData.organizationSelectedFields;
    const fieldChanges =
      type === "individual"
        ? formData.individualFieldChanges
        : formData.organizationFieldChanges;
    const fieldDocuments =
      type === "individual"
        ? formData.individualFieldDocuments
        : formData.organizationFieldDocuments;

    return (
      <div className="issue-sections">
        {selectedIssues.map((issue) => {
          const fieldList = SECTION_FIELDS[type][issue] || [];
          const issueSelectedFields = selectedFields.filter(
            (fieldKey) => parseFieldKey(fieldKey).issue === issue
          );

          return (
            <div key={issue} className="issue-section-card">
              <p className="issue-section-title">{issue}</p>
              <div className="field-change-builder">
                <div className="field-change-column">
                  <p className="field-change-title">Select Fields To Change</p>
                  <div className="field-change-list">
                    {fieldList.map((label) => {
                      const fieldKey = createFieldKey(issue, label);
                      return (
                        <label key={fieldKey} className="field-change-item">
                          <input
                            type="checkbox"
                            checked={issueSelectedFields.includes(fieldKey)}
                            onChange={() => handleLabelToggle(type, issue, label)}
                          />
                          <span className="field-label-name">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="field-change-column">
                  <p className="field-change-title">Update Selected Fields</p>
                  {issueSelectedFields.length === 0 ? (
                    <p className="field-change-empty-note">
                      Select at least one field in this section.
                    </p>
                  ) : (
                    <div className="field-change-inputs">
                      {issueSelectedFields.map((fieldKey) => {
                        const { label } = parseFieldKey(fieldKey);
                        const currentValue = resolveCurrentFieldValue(
                          type,
                          issue,
                          label
                        );

                        return (
                          <div key={fieldKey} className="field-change-card">
                            <label htmlFor={`${fieldKey}-current`}>
                              Current {label}
                            </label>
                            {renderCurrentValueControl(
                              currentValue,
                              `${fieldKey}-current`
                            )}
                            <label htmlFor={`${fieldKey}-replace`}>
                              Replace {label}
                            </label>
                            <input
                              id={`${fieldKey}-replace`}
                              type="text"
                              value={fieldChanges[fieldKey] || ""}
                              onChange={(e) =>
                                handleFieldChangeValue(
                                  type,
                                  issue,
                                  label,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter updated value for ${label}`}
                            />
                            <label htmlFor={`${fieldKey}-document`}>
                              Upload Document For {label}
                            </label>
                            <input
                              id={`${fieldKey}-document`}
                              type="file"
                              accept={fileAccept}
                              onChange={handleFieldDocumentChange(
                                type,
                                issue,
                                label
                              )}
                            />
                            {fieldDocuments[fieldKey]?.name && (
                              <p className="field-upload-name">
                                Selected file: {fieldDocuments[fieldKey].name}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const validateChangeRequest = (type) => {
    const selectedIssues =
      type === "individual" ? formData.individualIssues : formData.organizationIssues;
    const selectedFields =
      type === "individual"
        ? formData.individualSelectedFields
        : formData.organizationSelectedFields;
    const fieldChanges =
      type === "individual"
        ? formData.individualFieldChanges
        : formData.organizationFieldChanges;
    const fieldDocuments =
      type === "individual"
        ? formData.individualFieldDocuments
        : formData.organizationFieldDocuments;

    if (selectedIssues.length === 0) {
      alert("Please select at least one issue section.");
      return false;
    }

    if (selectedFields.length === 0) {
      alert("Please select at least one field to modify.");
      return false;
    }

    if (selectedFields.some((fieldKey) => !(fieldChanges[fieldKey] || "").trim())) {
      alert("Please enter replace text for all selected fields.");
      return false;
    }

    if (selectedFields.some((fieldKey) => !fieldDocuments[fieldKey])) {
      alert("Please upload a document for every selected field.");
      return false;
    }

    return true;
  };

  const buildFieldPayload = (type) => {
    const selectedFields =
      type === "individual"
        ? formData.individualSelectedFields
        : formData.organizationSelectedFields;
    const fieldChanges =
      type === "individual"
        ? formData.individualFieldChanges
        : formData.organizationFieldChanges;
    const fieldDocuments =
      type === "individual"
        ? formData.individualFieldDocuments
        : formData.organizationFieldDocuments;

    return selectedFields.map((fieldKey, index) => {
      const { issue, label } = parseFieldKey(fieldKey);
      const file = fieldDocuments[fieldKey] || null;

      return {
        issue,
        label,
        oldValue: resolveCurrentFieldValue(type, issue, label),
        newValue: fieldChanges[fieldKey] || "",
        documentField: file ? `${type}FieldDocument_${index}` : "",
        documentName: file?.name || ""
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        formData.applicantType === "individual" &&
        formData.individualIssueType === "agent-details-mistake" &&
        !validateChangeRequest("individual")
      ) {
        setIsSubmitting(false);
        return;
      }

      if (
        formData.applicantType === "other-than-individual" &&
        formData.organizationIssueType === "change-organization-details" &&
        !validateChangeRequest("organization")
      ) {
        setIsSubmitting(false);
        return;
      }

      const individualFieldPayload = buildFieldPayload("individual");
      const organizationFieldPayload = buildFieldPayload("organization");
      const formPayload = new FormData();

      formPayload.append("panNumber", panNumber);
      formPayload.append("applicationNo", formData.applicationNo);
      formPayload.append("applicantType", formData.applicantType);

      formPayload.append("individualIssueType", formData.individualIssueType);
      formPayload.append("individualIssue", formData.individualIssues.join(", "));
      formPayload.append(
        "individualDescription",
        individualFieldPayload
          .map((item) => `${item.issue} - ${item.label}: ${item.newValue}`)
          .join("\n")
      );
      formPayload.append(
        "individualFieldChanges",
        JSON.stringify(individualFieldPayload)
      );
      formPayload.append("individualChangeDocument", formData.individualChangeDocument);
      formPayload.append("individualReplaceReason", formData.individualReplaceReason);

      formPayload.append("organizationIssueType", formData.organizationIssueType);
      formPayload.append("organizationIssue", formData.organizationIssues.join(", "));
      formPayload.append(
        "organizationDescription",
        organizationFieldPayload
          .map((item) => `${item.issue} - ${item.label}: ${item.newValue}`)
          .join("\n")
      );
      formPayload.append(
        "organizationFieldChanges",
        JSON.stringify(organizationFieldPayload)
      );
      formPayload.append(
        "organizationChangeDocument",
        formData.organizationChangeDocument
      );
      formPayload.append(
        "organizationReplaceReason",
        formData.organizationReplaceReason
      );

      individualFieldPayload.forEach((item, index) => {
        const file =
          formData.individualFieldDocuments[createFieldKey(item.issue, item.label)];
        if (file) {
          formPayload.append(`individualFieldDocument_${index}`, file);
        }
      });

      organizationFieldPayload.forEach((item, index) => {
        const file =
          formData.organizationFieldDocuments[createFieldKey(item.issue, item.label)];
        if (file) {
          formPayload.append(`organizationFieldDocument_${index}`, file);
        }
      });

      if (formData.individualReplacementFile) {
        formPayload.append("individualReplacementFile", formData.individualReplacementFile);
      }

      if (formData.organizationReplacementFile) {
        formPayload.append(
          "organizationReplacementFile",
          formData.organizationReplacementFile
        );
      }

      await apiPost("/api/change-request/save", formPayload);
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to submit change request");
    }

    setIsSubmitting(false);
  };

  const displayedAgentInfo = applicationDetails?.agent_details || agentInfo || {};
  const displayApplicationNumber =
    formData.applicationNo || displayedAgentInfo?.application_no || "-";
  const displayAgentName = displayedAgentInfo?.agent_name || "-";
  const displayAddress =
    displayedAgentInfo?.address1 || displayedAgentInfo?.address_line_1 || "-";
  const displayStatus = displayedAgentInfo?.status || "-";

  return (
    <div className="change-request-page">
      {showSuccess && (
        <div className="success-overlay" role="alert" aria-live="assertive">
          <div className="success-blast">
            <span className="blast-ring blast-ring-one" />
            <span className="blast-ring blast-ring-two" />
            <span className="blast-dot blast-dot-one" />
            <span className="blast-dot blast-dot-two" />
            <span className="blast-dot blast-dot-three" />
            <span className="blast-dot blast-dot-four" />
            <div className="success-card">
              <div className="success-icon">
                <i className="fas fa-check" />
              </div>
              <h3>Change Request Submitted by After Payment</h3>
              <button
                type="button"
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/agent-change-request-payment");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="change-request-hero">
        <div className="hero-title-wrapper">
          <h2>Apply for Change Request</h2>
        </div>
        <p className="hero-caption">Agent Services</p>
        
        <div className="change-request-stepper-card">
          <AgentChangeRequestStepper activeStep={2} />
        </div>
      </div>

      <div className="change-request-container">
        <div className="change-request-header">
          <p className="eyebrow">Agent Services</p>
          {/* <p className="pan-display">
            PAN Number : <strong>{panNumber}</strong>
          </p>
          <p className="pan-display">
            Application Number : <strong>{panNumber}</strong>
          </p>
          <p className="pan-display">
            User Name : <strong>{panNumber}</strong>
          </p>
          <p className="pan-display">
            Address : <strong>{panNumber}</strong>
          </p>
          <p className="pan-display">
            Status : <strong>{panNumber}</strong>
          </p> */}

          <p className="pan-display">
            PAN Number : <strong>{panNumber}</strong>
          </p>
          <p className="pan-display">
            Application Number : <strong>{displayApplicationNumber}</strong>
          </p>
          <p className="pan-display">
            User Name : <strong>{displayAgentName}</strong>
          </p>
          <p className="pan-display">
            Address : <strong>{displayAddress}</strong>
          </p>
          <p className="pan-display">
            Status : <strong>{displayStatus}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="change-request-form">
          <label>Application Number</label>
          {applicationOptions.length === 0 ? (
            <p className="field-change-empty-note">
              No application number available for this PAN
            </p>
          ) : formData.applicationNo ? (
            <p className="field-change-title">{formData.applicationNo}</p>
          ) : (
            <p className="field-change-empty-note">
              Loading application number...
            </p>
          )}
          {formData.applicationNo && isLoadingApplicationDetails && (
            <p className="field-change-empty-note">Loading application details...</p>
          )}

          <label>Select Applicant Type</label>
          <div className="applicant-type-group">
            <label
              className={`applicant-type-option ${
                formData.applicantType === "individual" ? "selected" : ""
              }`}
              htmlFor="typeIndividual"
            >
              <input
                id="typeIndividual"
                type="radio"
                name="applicantType"
                value="individual"
                checked={formData.applicantType === "individual"}
                onChange={handleChange}
                required
              />
              <span className="dot" />
              <span>Individual</span>
            </label>
            <label
              className={`applicant-type-option ${
                formData.applicantType === "other-than-individual"
                  ? "selected"
                  : ""
              }`}
              htmlFor="typeOtherThanIndividual"
            >
              <input
                id="typeOtherThanIndividual"
                type="radio"
                name="applicantType"
                value="other-than-individual"
                checked={formData.applicantType === "other-than-individual"}
                onChange={handleChange}
                required
              />
              <span className="dot" />
              <span>Other than Individual</span>
            </label>
          </div>

          {formData.applicantType === "individual" && (
            <>
              <label htmlFor="individualIssueType">Select Issue</label>
              <select
                id="individualIssueType"
                name="individualIssueType"
                value={formData.individualIssueType}
                onChange={handleChange}
                required
              >
                <option value="">Select Issue</option>
                {individualIssueTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {formData.applicantType === "individual" &&
            formData.individualIssueType === "agent-details-mistake" && (
              <>
                {renderIssueSelector("individual", formData.individualIssues)}
                {renderFieldChangeBuilder("individual", formData.individualIssues)}
              </>
            )}

          {formData.applicantType === "individual" &&
            formData.individualIssueType === "upload-documents-mistake" && (
              <>
                <label htmlFor="individualChangeDocument">Select the Document</label>
                <select
                  id="individualChangeDocument"
                  name="individualChangeDocument"
                  value={formData.individualChangeDocument}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select the Document</option>
                  {individualDocumentOptions.map((documentName) => (
                    <option key={documentName} value={documentName}>
                      {documentName}
                    </option>
                  ))}
                </select>

                <label htmlFor="individualReplaceReason">
                  Description for Replacing the File
                </label>
                <textarea
                  id="individualReplaceReason"
                  name="individualReplaceReason"
                  placeholder="Explain why you want to replace the uploaded file"
                  value={formData.individualReplaceReason}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="individualReplacementFile">Upload New File</label>
                <input
                  id="individualReplacementFile"
                  type="file"
                  accept={fileAccept}
                  onChange={handleFileChange("individualReplacementFile")}
                  required
                />
              </>
            )}

          {formData.applicantType === "other-than-individual" && (
            <>
              <label htmlFor="organizationIssueType">Select Issue</label>
              <select
                id="organizationIssueType"
                name="organizationIssueType"
                value={formData.organizationIssueType}
                onChange={handleChange}
                required
              >
                <option value="">Select Issue</option>
                {organizationIssueTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {formData.applicantType === "other-than-individual" &&
            formData.organizationIssueType === "change-organization-details" && (
              <>
                {renderIssueSelector("organization", formData.organizationIssues)}
                {renderFieldChangeBuilder(
                  "organization",
                  formData.organizationIssues
                )}
              </>
            )}

          {formData.applicantType === "other-than-individual" &&
            formData.organizationIssueType === "upload-document-change" && (
              <>
                <label htmlFor="organizationChangeDocument">
                  Select the Document
                </label>
                <select
                  id="organizationChangeDocument"
                  name="organizationChangeDocument"
                  value={formData.organizationChangeDocument}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select the Document</option>
                  {organizationDocumentOptions.map((documentName) => (
                    <option key={documentName} value={documentName}>
                      {documentName}
                    </option>
                  ))}
                </select>

                <label htmlFor="organizationReplaceReason">
                  Description for Replacing the File
                </label>
                <textarea
                  id="organizationReplaceReason"
                  name="organizationReplaceReason"
                  placeholder="Explain why you want to replace the uploaded file"
                  value={formData.organizationReplaceReason}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="organizationReplacementFile">
                  Upload New File
                </label>
                <input
                  id="organizationReplacementFile"
                  type="file"
                  accept={fileAccept}
                  onChange={handleFileChange("organizationReplacementFile")}
                  required
                />
              </>
            )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangeRequestForm;