import axios from "axios";

const API_URL = "http://localhost:5000/api/projects";

export const fetchProjectsApi = async (pagination) => {
  const response = await axios.get(API_URL, {
    params: {
      page: pagination.currentPage,
      limit: pagination.rowsPerPage,
    },
  });
  return {
    data: response.data.data, // Extract the `data` array from the response
    totalPages: Math.ceil(response.data.data.length / pagination.rowsPerPage), // Calculate totalPages if not provided by the API
  };
};
export const createProjectApi = async (projectData) => {
  const response = await axios.post(API_URL, projectData);
  return response;
};
export const deleteProjectApi = async (projectId) => {
  await axios.delete(`${API_URL}/${projectId}`);
  return projectId;
};

export const updateProjectApi = async (project) => {
  const response = await axios.patch(`${API_URL}/${project._id}`, project);
  return response.data.data;
};
