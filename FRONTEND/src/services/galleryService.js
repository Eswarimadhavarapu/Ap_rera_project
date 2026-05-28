import { DEV_BACKEND_URL } from "../api/api";

const BASE_URL = import.meta.env.MODE === "production" ? "" : DEV_BACKEND_URL;

export async function uploadProjectImage(appNo, file, title = "", description = "") {
  try {
    const formData = new FormData();
    formData.append("application_number", appNo);
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);

    const res = await fetch(`${BASE_URL}/api/project-gallery/upload`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (err) {
    console.error("uploadProjectImage error:", err);
    return { success: false, error: err.message };
  }
}