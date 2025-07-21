import { Category, NoteText } from "iconsax-react";

export const dashboardSideMenuItes = [
    {
        allowed_to: ['admin', 'company-manager', 'employee'],
        title: 'Dashboard',
        path: '/test_dashboard',
        icon: <Category/>
    },
    {
        allowed_to: ['admin', 'company-manager'],
        title: 'Projects',
        path: '/test_dashboard/projects',
        icon: <NoteText />
    }
];