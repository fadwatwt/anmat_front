// projectSelectors.js
export const selectAllProjects = (state) => state.projects.projects || [];
export const selectProjectStatus = (state) => state.projects.status;
export const selectPagination = (state) => state.projects.pagination;
