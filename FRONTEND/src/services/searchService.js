import { apiGet } from "../api/api";

export const searchProjects = async (params) => {
  const queryParams = new URLSearchParams(params).toString();
  return apiGet(`/api/search/projects?${queryParams}`);
};

export const fetchPublicProjectDetails = async (applicationNumber) => {
  return apiGet(`/api/search/projects/${applicationNumber}`);
};