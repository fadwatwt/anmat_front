// dashboardSideMenuItems.js
import { Setting, Edit, Share, Messages1, Category, Profile2User, TaskSquare, NoteText, Chart2, Cpu, PercentageCircle, Buildings, Stickynote, Setting4, Setting5, ReceiptText, Category2, Tag, EmptyWallet } from 'iconsax-react';

// ['Admin', 'Subscriber', 'Employee']

export const dashboardSideMenuItems = [
    {
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Category />
    },
    {
        allowed_to: ['Admin'],
        title: 'System Admins',
        path: '/system-admins',
        icon: <Profile2User />
    },
    {
        allowed_to: ['Admin'],
        title: 'Roles',
        path: '/roles',
        icon: <Setting4 />
    },
    {
        allowed_to: ['Admin'],
        title: 'Industries',
        path: '/industries',
        icon: <Category2 />
    },
    {
        allowed_to: ['Subscriber'],
        title: 'Subscriptions',
        path: '/subscriptions',
        icon: <ReceiptText />
    },
    {
        allowed_to: ['Subscriber'],
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
        allowed_to: ['Subscriber'],
        title: 'Roles',
        path: '/roles',
        icon: <Setting4 />
    },
    {
        allowed_to: ['Subscriber'],
        title: 'Permissions',
        path: '/permissions',
        icon: <Setting5 />
    },
    {
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'Analytics',
        path: '/analytics',
        icon: <Chart2 />
    },
    {
        allowed_to: ['Admin'],
        title: 'Subscribers',
        path: '/subscriptions',
        icon: <Tag />
    },
    {
        allowed_to: ['Admin'],
        title: 'Plans',
        path: '/plans',
        icon: <PercentageCircle />
    },
    {
        allowed_to: ['Admin'],
        title: 'Money Receiving Methods',
        path: '/money-receiving',
        icon: <EmptyWallet />
    },
    {
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Tasks',
        path: '/tasks',
        icon: <TaskSquare />
    },
    {
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Projects',
        path: '/projects',
        icon: <NoteText />
    },
    {
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Conversations',
        path: '/conversations',
        icon: <Messages1 />
    },
    {
        allowed_to: ['Subscriber'],
        title: 'Social Media',
        path: '/social-media',
        icon: <Share />
    },
    {
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Timeline',
        path: '/time-line',
        icon: <Edit />
    },
    {
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'Settings',
        path: '/setting',
        icon: <Setting />
    },
    {
        allowed_to: ['Subscriber'],
        title: 'AI Assistant',
        path: '/ai',
        icon: <Cpu />
    }
];
