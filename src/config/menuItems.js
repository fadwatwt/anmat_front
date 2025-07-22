// dashboardSideMenuItems.js
import { Setting, Edit, Share, Messages1, Category, Profile2User, TaskSquare, NoteText, Chart2, Cpu } from 'iconsax-react';

export const dashboardSideMenuItems = [
    {
        allowed_to: ['admin'],
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Category />
    },
    {
        allowed_to: ['company-manager'],
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Category />
    },
    {
        allowed_to: ['employee'],
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Category />
    },
    {
        allowed_to: ['admin', 'company-manager'],
        title: 'Projects',
        path: '/dashboard/projects',
        icon: <NoteText />
    },
    {
        allowed_to: ['admin', 'company-manager', 'employee'],
        title: 'Tasks',
        path: '/dashboard/tasks',
        icon: <TaskSquare />
    },
    {
        allowed_to: ['admin'],
        title: 'Analytics',
        path: '/admin/analytics',
        icon: <Chart2 />
    },
    {
        allowed_to: ['company-manager'],
        title: 'Analytics',
        path: '/dashboard/analytics',
        icon: <Chart2 />
    },
    {
        allowed_to: ['company-manager'],
        title: 'Analytics',
        path: '/employee/analytics',
        icon: <Chart2 />
    },
    {
        allowed_to: ['admin', 'company-manager'],
        title: 'HR Management',
        path: '/dashboard/hr',
        icon: <Profile2User />
    },
    {
        allowed_to: ['admin', 'employee','company-manager'],
        title: 'Conversations',
        path: '/dashboard/conversations',
        icon: <Messages1 />
    },
    {
        allowed_to: ['admin', 'company-manager'],
        title: 'Social Media',
        path: '/dashboard/social-media',
        icon: <Share />
    },
    {
        allowed_to: ['admin', 'company-manager', 'employee'],
        title: 'Timeline',
        path: '/dashboard/time-line',
        icon: <Edit />
    },
    {
        allowed_to: ['admin','company-manager', 'employee'],
        title: 'Settings',
        path: '/dashboard/setting',
        icon: <Setting />
    },
    {
        allowed_to: ['admin','company-manager'],
        title: 'AI Assistant',
        path: '/ai-assistant',
        icon: <Cpu />
    }
];
