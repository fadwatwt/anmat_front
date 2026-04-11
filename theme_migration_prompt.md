# Theme Migration Prompt: Implementing Semantic Light/Dark Themes

## Context & Objective
The goal is to update existing React components, pages, and UI elements (using Tailwind CSS) to fully support dynamic light and dark themes. Instead of using hardcoded light colors and manual `dark:` overrides (e.g., `bg-white dark:bg-gray-800`), we use a custom system of semantic, theme-aware Tailwind classes that automatically adapt to the active theme via CSS variables defined in global stylesheets.

---

## 🎨 Semantic Class Mapping Guide

When updating a component, replace the legacy hardcoded classes with their semantic equivalents from the following mappings:

### 1. Backgrounds
*   **Main Containers / Cards / Modals / Tables:**
    *   *Legacy:* `bg-white dark:bg-gray-900` or `dark:bg-white-0`
    *   **New:** `bg-surface`
*   **Inputs / Secondary Containers / Subtle Backgrounds / List Item Hovers:**
    *   *Legacy:* `bg-gray-50 dark:bg-gray-800` or `hover:bg-gray-100 dark:hover:bg-gray-700`
    *   **New:** `bg-status-bg` or `hover:bg-status-bg`

### 2. Typography (Text Colors)
*   **Primary Text (Titles, Names, Main Content):**
    *   *Legacy:* `text-gray-900 dark:text-white` or `text-black`
    *   **New:** `text-cell-primary`
*   **Secondary Text (Descriptions, Dates, Subtitles, Input Holders):**
    *   *Legacy:* `text-gray-500 dark:text-gray-400` or `text-gray-600`
    *   **New:** `text-cell-secondary`
*   **Table Specific Titles:**
    *   *Legacy:* `text-black font-bold` 
    *   **New:** `text-table-title`

### 3. Borders & Dividers
*   **General Borders (Cards, Inputs, Modals, Tables, Dropdowns):**
    *   *Legacy:* `border-gray-200 dark:border-gray-700` or `border-gray-300`
    *   **New:** `border-status-border`

### 4. Interactive Elements (Badges & Tags)
*   **Neutral / Standard Badges:**
    *   *Legacy:* `bg-blue-50 text-blue-700` or `bg-gray-100 text-gray-800`
    *   **New:** `bg-badge-bg text-badge-text border border-status-border`
*   **Primary Brand Actions (Buttons, Active Icons):**
    *   Keep using the brand palette without dark overrides where appropriate. 
    *   *Example:* `bg-primary-500 text-white hover:bg-primary-600 transition-colors`
*   **Status Indicators (Success/Error - mostly kept as is, but ensure dark variants exist):**
    *   *Success:* `bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800`
    *   *Error:* `bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800`

---

## 🛠 Workflow for Updating Files

Follow this systematic approach when asked to update a specific page or component:

1.  **Analyze the Target File:** Identify all markup elements containing hardcoded colors (e.g., `text-gray-*`, `bg-white`, `dark:bg-*`, `border-gray-*`).
2.  **Strip Legacy Classes:** Remove the hardcoded color values and any `dark:` variants tied to them.
3.  **Inject Theme Classes:** Apply the appropriate semantic class from the mapping guide above.
4.  **Check Sub-components:** Ensure that reusable form elements (like [InputAndLabel](file:///d:/Work/Fadwa/Anmat/Frontend/anmat_front/src/components/Form/InputAndLabel.jsx#5-42), [TagInput](file:///d:/Work/Fadwa/Anmat/Frontend/anmat_front/src/components/Form/TagInput.jsx#5-166), [SelectAndLabel](file:///d:/Work/Fadwa/Anmat/Frontend/anmat_front/src/components/Form/SelectAndLabel.jsx#5-60), [CustomSelect](file:///d:/Work/Fadwa/Anmat/Frontend/anmat_front/src/components/Form/DefaultSelect.jsx#8-240)) used inside the target are already theme-aware, or update them globally if they are not.
5.  **Focus on Page-Level Rows:** When updating pages with tables (e.g., `rows` variable mapped over API data), pay special attention to:
    *   List identifiers/names (`text-cell-primary`)
    *   Metadata/Dates (`text-cell-secondary`)
    *   Inline status badges or labels (`bg-badge-bg`, `text-badge-text`, `border-status-border`)
6.  **Add Polish:** Ensure smooth interactive states by adding `transition-colors` where hover backgrounds or borders are applied (e.g., `hover:bg-status-bg transition-colors`).

---

## 🤖 Example Instruction for Next Chat

**PROMPT TO SEND TO THE AGENT:**
> "I want you to act as an expert frontend engineer. We are migrating our React/Tailwind application to a semantic light/dark theme system. Please review the provided component/page and apply the theme classes according to our standard mapping. Replace all hardcoded `text-gray-*`, `bg-white`, `dark:bg-*`, and `border-gray-*` classes. Use `bg-surface` for main backgrounds, `bg-status-bg` for secondary/inputs backgrounds, `border-status-border` for all borders, `text-cell-primary` for main text, `text-cell-secondary` for subtitles/hints, and `bg-badge-bg text-badge-text border border-status-border` for generic badges. Make sure to remove any conflicting `dark:` utility variants where semantic classes are applied."
