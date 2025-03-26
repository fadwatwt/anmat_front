import axios from "axios";
import { RootRoute } from "../../Root.Route";

// Fetch projects with pagination
export const fetchProjectsApi = async (pagination) => {
  const response = await axios.get(`${RootRoute}/projects`, {
    params: {
      page: pagination.currentPage,
      limit: pagination.rowsPerPage,
    },
  });

  // Ensure the API response structure matches your expectations
  const { data, totalCount } = response.data; // Assuming the API returns `data` and `totalCount`

  return {
    data: data, // Array of projects
    totalPages: Math.ceil(totalCount / pagination.rowsPerPage), // Calculate totalPages based on totalCount
  };
};

// Create a new project
export const createProjectApi = async (projectData) => {
  const response = await axios.post(`${RootRoute}/projects`, projectData);
  return response.data.data; // Return the created project
};

// Delete a project by ID
export const deleteProjectApi = async (projectId) => {
  await axios.delete(`${RootRoute}/projects/${projectId}`);
  return projectId; // Return the deleted project ID
};

// Update an existing project
export const updateProjectApi = async (project) => {
  const response = await axios.patch(
    `${RootRoute}/projects/${project._id}`,
    project
  );
  return response.data.data; // Return the updated project
};

// Get a single project by ID
export const getProjectByIdApi = async (projectId) => {
  const response = await axios.get(`${RootRoute}/projects/${projectId}`);
  return response.data.data; // Return the project data
};
