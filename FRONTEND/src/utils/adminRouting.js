export const normalizeAdminDepartment = (admin) => {
  const values = [
    String(admin?.role || "").trim().toLowerCase(),
    String(admin?.department || "").trim().toLowerCase(),
  ].filter(Boolean);

  const combined = values.join(" ");

  if (combined.includes("chairperson") || combined.includes("chairman")) {
    return "chairman";
  }
  if (combined.includes("assistant director")) {
    return "ad";
  }
  if (combined.includes("deputy director")) {
    return "dd";
  }
  if (combined.includes("director") || combined.includes("directory")) {
    return "director";
  }
  if (combined.includes("it")) {
    return "it";
  }
  if (combined.includes("verification")) {
    return "verification";
  }
  if (combined.includes("planning")) {
    return "planning";
  }
  if (combined.includes("legal 1") || combined.includes("l1")) {
    return "l1";
  }
  if (combined.includes("legal 2") || combined.includes("l2")) {
    return "l2";
  }
  if (combined.includes("legal")) {
    return "legal";
  }
  if (combined.includes("audit")) {
    return "audit";
  }
  if (combined.includes("engineer")) {
    return "engineer";
  }

  return values[1] || values[0] || "";
};

export const isPlatformAdmin = (admin) => {
  const role = String(admin?.role || "").trim().toLowerCase();
  return role === "admin" || role === "super_admin" || role === "super admin";
};

export const getDepartmentDashboardRoute = (dept, admin = null) => {
  const deptRoutes = {
    planning: "/scrutiny/planning/planning-dashboard",
    legal: "/scrutiny/legal/legal-dashboard",
    audit: "/scrutiny/audit/audit-dashboard",
    engineer: "/scrutiny/scrutiny-engineer",
    verification: "/scrutiny/verification/verification-dashboard",
    ad: "/scrutiny/ad/ad-dashboard",
    dd: "/scrutiny/dd/dd-dashboard",
    director: "/scrutiny/director/director-dashboard",
    chairman: "/scrutiny/chairman/chairman-dashboard",
    it: "/scrutiny/it/it-dashboard",
    l1: "/scrutiny/L1/L1-dashboard",
    l2: "/scrutiny/L2/L2-dashboard",
  };

  if (deptRoutes[dept]) {
    return deptRoutes[dept];
  }

  if (isPlatformAdmin(admin)) {
    return "/admin-dashboard";
  }

  return "/department";
};