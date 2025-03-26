/**
 * Function to filter and sort an array of tasks.
 * @param {Array} tasks - The array of task objects.
 * @param {string} key - The key to sort/filter by (e.g., "delivery", "rate").
 * @param {boolean} isAscending - Determines if the sorting is ascending (true) or descending (false).
 * @returns {Array} - The filtered and sorted array.
 */
function filterAndSortTasks(tasks, key, isAscending = true) {
    return tasks.slice().sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        // Handle null or undefined values
        if (valA == null && valB == null) return 0;
        if (valA == null) return isAscending ? 1 : -1;
        if (valB == null) return isAscending ? -1 : 1;

        // Compare values
        if (typeof valA === "string" && typeof valB === "string") {
            return isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (typeof valA === "number" && typeof valB === "number") {
            return isAscending ? valA - valB : valB - valA;
        }

        // Add additional comparisons if needed
        return 0;
    });
}

export {filterAndSortTasks}
