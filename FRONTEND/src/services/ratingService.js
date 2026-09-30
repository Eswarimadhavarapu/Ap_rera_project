import { apiGet, apiPost } from "../api/api";

export const getProjectRatings = async (applicationNumber) => {
  return apiGet(`/api/project-ratings/${applicationNumber}`);
};

export const submitDirectorRating = async (payload) => {
  return apiPost(`/api/director/project-ratings`, payload);
};

export const getCompletedProjectsForDirector = async (directorId) => {
  return apiGet(`/api/director/completed-projects?director_user_id=${directorId}`);
};