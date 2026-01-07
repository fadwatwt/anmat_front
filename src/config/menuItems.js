// dashboardSideMenuItems.js
import { Setting, Edit, Share, Messages1, Category, Profile2User, TaskSquare, NoteText, Chart2, Cpu, PercentageCircle, Buildings, Stickynote, Setting4, Setting5, ReceiptText } from 'iconsax-react';

// ['Admin', 'Company-Manager', 'Employee']

export const dashboardSideMenuItems = [
    {
        allowed_to: ['Admin', 'Company-Manager', 'Employee'],
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Category />
    },
    {
        allowed_to: ['Admin'],
        title: 'Companies',
        path: '/companies',
        icon: <Buildings />
    },
    {
        allowed_to: ['Admin'],
        title: 'Plans',
        path: '/plans',
        icon: <PercentageCircle />
    },
    {
        allowed_to: ['Admin', 'Company-Manager'],
        title: 'Subscriptions',
        path: '/subscriptions',
        icon: <ReceiptText />
    },
    {
        allowed_to: ['Admin'],
        title: 'Orders',
        path: '/orders',
        icon: <Stickynote />
    },
    {
        allowed_to: ['Company-Manager'],
        title: 'HR Management',
        path: '/hr',
        icon: <Profile2User />,
        children: [
            { title: 'Employees', path: '/hr/employees' },
            { title: 'Departments', path: '/hr/departments' },
            { title: 'Teams', path: '/hr/teams' },
            { title: 'Positions', path: '/hr/positions' },
            { title: 'Meetings', path: '/hr/meetings' },
            { title: 'Chats', path: '/hr/chats' },
            { title: 'Holidays', path: '/hr/holidays' },
            { title: 'Financials', path: '/hr/financials' },
        ]
    },
    {
        allowed_to: ['Company-Manager'],
        title: 'Roles',
        path: '/roles',
        icon: <Setting4 />
    },
    {
        allowed_to: ['Company-Manager'],
        title: 'Permissions',
        path: '/permissions',
        icon: <Setting5 />
    },
    {
        allowed_to: ['Admin', 'Company-Manager', 'Employee'],
        title: 'Analytics',
        path: '/analytics',
        icon: <Chart2 />
    },
    {
        allowed_to: ['Company-Manager', 'Employee'],
        title: 'Tasks',
        path: '/tasks',
        icon: <TaskSquare />
    },
    {
        allowed_to: ['Company-Manager', 'Employee'],
        title: 'Projects',
        path: '/projects',
        icon: <NoteText />
    },
    {
        allowed_to: ['Company-Manager', 'Employee'],
        title: 'Conversations',
        path: '/conversations',
        icon: <Messages1 />
    },
    {
        allowed_to: ['Company-Manager'],
        title: 'Social Media',
        path: '/social-media',
        icon: <Share />
    },
    {
        allowed_to: ['Company-Manager', 'Employee'],
        title: 'Timeline',
        path: '/time-line',
        icon: <Edit />
    },
    {
        allowed_to: ['Admin', 'Company-Manager', 'Employee'],
        title: 'Settings',
        path: '/setting',
        icon: <Setting />
    },
    {
        allowed_to: ['Company-Manager'],
        title: 'AI Assistant',
        path: '/ai',
        icon: <Cpu />
    }
];
