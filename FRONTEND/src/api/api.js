// src/api/api.js


// const isProduction = import.meta.env.MODE === "production";

// /**
//  * Backend Base URL
//  * - Dev: DevTunnel backend (8080)
//  * - Prod: real domain
//  */
// //export const DEV_BACKEND_URL = "https://n7vxv3pg-8081.inc1.devtunnels.ms";
// export const DEV_BACKEND_URL = "http://localhost:8080";
//  //const DEV_BACKEND_URL = "http://localhost:8080";

// const PROD_BACKEND_URL = "https://your-production-domain.com";

// export const BASE_URL = isProduction
//   ? PROD_BACKEND_URL
//   : DEV_BACKEND_URL;
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// ================================
// 🔁 API FETCH WRAPPER
// ================================
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const isFormData = options.body instanceof FormData;

   const token = localStorage.getItem("token");
  console.log("TOKEN SENT =", token);

  // 👇 REPLACE FETCH BLOCK
  const res = await fetch(url, {
    mode: "cors",
    headers: {
      ...(isFormData
        ? {}
        : { "Content-Type": "application/json" }),

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },

    ...options,
  });


  const raw = await res.text();

  // Detect tunnel HTML error
  if (raw.startsWith("<!DOCTYPE html>")) {
    throw new Error("Backend not reachable or DevTunnel expired");
  }

  let data;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

 if (!res.ok) {

  // JWT Token Expired
  if (
    data?.msg === "Token has expired" ||
    data?.error === "Token has expired"
  ) {

    localStorage.clear();

    alert("Session expired. Please login again.");

    window.location.href = "/login";

    return;
  }

  throw new Error(
    (data && (data.error || data.message || data.msg)) ||
    `HTTP ${res.status}`
  );
}

  return data;
}

// ================================
// API HELPERS
// ================================
export const apiGet = (url) =>
  apiFetch(url, { method: "GET" });

export const apiPost = (url, body) =>
  apiFetch(url, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const apiPut = (url, body) =>
  apiFetch(url, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

export const apiDelete = (url) =>
  apiFetch(url, { method: "DELETE" });

// ================================
// SPECIFIC API ENDPOINTS FOR NEW USER REGISTRATION
// ================================

// Get all states
export const getStates = () => apiGet("/api/states");

// Get districts by state ID
export const getDistricts = (stateId) => {
  if (!stateId) return Promise.resolve([]);
  return apiGet(`/api/districts/${stateId}`);
};

// Get mandals by district ID
export const getMandals = (districtId) => {
  if (!districtId) return Promise.resolve([]);
  return apiGet(`/api/mandals/${districtId}`);
};

// Get villages by mandal ID
export const getVillages = (mandalId) => {
  if (!mandalId) return Promise.resolve([]);
  return apiGet(`/api/villages/${mandalId}`);
};

// Submit new promoter registration
export const submitPromoterRegistration = (formData) => {
  return apiPost("/api/promoter/registration", formData);
};

// Optional: Check if PAN already exists
export const checkPanExists = (panNumber) => {
  return apiGet(`/api/check-pan/${panNumber}`);
};

export const getProjectByPan = (panNumber) => {
  return apiGet(`/api/project/basic-details-by-pan?pan=${panNumber}`);
};

// Submit Change Request (FormData)
export const submitChangeRequest = (formData) => {
  return apiPost("/api/change-request", formData);
};


// ================================
// EXEMPTION MODULE APIs
// ================================

// Create exemption request (with file upload)
export const createExemption = (formData) => {
  return apiPost("/api/project_exemption/create", formData);
};


// ================================
// EXEMPTION MODULE APIs
// ================================

// Get all exemption applications
export const getExemptionList = () => {
  return apiGet("/api/project_exemption/all");
};

// Get single exemption
export const getExemptionById = (id) => {
  return apiGet(`/api/project_exemption/${id}`);
};

// Stage 1 (Engineer remarks)
export const submitStage1 = (id, data) => {
  return apiFetch(`/api/project_exemption/${id}/stage1`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// Stage 2 (Approve/Reject)
export const submitStage2 = (id, data) => {
  return apiFetch(`/api/project_exemption/${id}/stage2`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// Stage 3 (Send certificate)
export const submitStage3 = (id, data) => {
  return apiFetch(`/api/project_exemption/${id}/stage3`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// Send rejection email
export const sendRejectionEmail = (id, data) => {
  return apiFetch(`/api/project_exemption/${id}/send-rejection-email`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};


// ================================
// COMPLAINT MODULE APIs
// ================================

// Get complaint list
export const getComplaints = () => {
  return apiGet("/api/complint/list");
};
// Get single complaint
export const getComplaintById = (complaintId) => {
  return apiGet(`/api/complint/${complaintId}`);
};

// Register official case number
export const registerCase = (payload) => {
  return apiPost(
    "/api/complint/register-case",
    payload
  );
};

// Get hearings
export const getHearings = (complaintId) => {
  return apiGet(
    `/api/complint/hearings/${complaintId}`
  );
};
export const getCalendarHearings = () => {
  return apiGet("/api/complint/calendar");
};

// Add hearing
export const addHearing = (formData) => {
  return apiPost(
    "/api/complint/add-hearing",
    formData
  );
};

export const getRTIList = (page = 1, status = "", fromDate = "", toDate = "") => {
  const params = new URLSearchParams({ page });
  if (status) params.append("status", status);
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);
  return apiGet(`/api/rti/list?${params.toString()}`);
};

export const getRTIById = (id) => apiGet(`/api/rti/${id}`);

export const createRTI = (formData) => apiPost("/api/rti/create", formData);

export const updateRTI = (id, formData) =>
  apiFetch(`/api/rti/updates/${id}`, { method: "PATCH", body: formData });
export const sendReturnApplication = (id, formData) =>
  apiFetch(`/api/rti/send-return_application/${id}`, { method: "PATCH", body: formData });

// Inform APIO  (PATCH /api/rti/updates/:id)
export const informAPIORTI = (id, formData) =>
  apiFetch(`/api/rti/updates/${id}`, { method: "PATCH", body: formData });

// Create assignments  (POST /api/rti/assignment/create)
export const createRTIAssignment = (formData) =>
  apiPost("/api/rti/assignment/create", formData);

// Update single assignment  (PATCH /api/rti/assignment/update/:id)
export const updateRTIAssignment = (id, formData) =>
  apiFetch(`/api/rti/assignment/update/${id}`, { method: "PATCH", body: formData });

// Get assignments by RTI application id
export const getAssignmentsByRTI = (rtiAppId) =>
  apiGet(`/api/rti/assignments/${rtiAppId}`);

// Get assignments by department
export const getAssignmentsByDept = (dept) =>
  apiGet(`/api/rti/assignments/department/${dept}`);

// Send OTP
export const sendRTIOTP = (email) =>
  apiFetch("/api/rti/send-email-otp", { method: "POST", body: JSON.stringify({ email }) });

// Verify OTP
export const verifyRTIOTP = (email, otp) =>
  apiFetch("/api/rti/verify-email-otp", { method: "POST", body: JSON.stringify({ email, otp }) });





// ================================
// ✅ PROJECT EXTENSION MODULE APIs
// ================================

/**
 * Create a new project extension application.
 * Sends FormData including all uploaded files + form fields + payment details.
 * Called from ExtensionPaymentPage after payment success.
 */
export const createProjectExtension = (formData) => {
  return apiPost("/api/project-extension/create", formData);
};

/**
 * Get paginated list of all project extension applications.
 * @param {number} page - Page number (default 1)
 * @param {number} perPage - Records per page (default 10)
 */
export const getProjectExtensionList = (page = 1, perPage = 10) => {
  return apiGet(`/api/project-extension/list?page=${page}&per_page=${perPage}`);
};

/**
 * Get a single project extension application by its DB id.
 * @param {number} id - The record ID
 */
export const getProjectExtensionById = (id) => {
  return apiGet(`/api/project-extension/${id}`);
};

/**
 * Update an existing project extension application (PATCH).
 * Accepts FormData for file + field updates.
 * @param {number} id - The record ID
 * @param {FormData} formData - Fields and/or files to update
 */
export const updateProjectExtension = (id, formData) => {
  return apiFetch(`/api/project-extension/update/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

/**
 * Send an email related to a project extension application.
 * @param {object} payload - { email, subject, body }
 */
export const sendProjectExtensionMail = (payload) => {
  return apiPost("/api/project-extension/send-mail", payload);
};
export const getUserDetails = (id) =>
  apiGet(`/api/userDetails/${id}`);