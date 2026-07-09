// dashboardSideMenuItems.js
import { Setting, Share, Messages1, Category, Profile2User, TaskSquare, NoteText, Chart2, Cpu, PercentageCircle, Stickynote, Setting4, Setting5, ReceiptText, Category2, Tag, EmptyWallet, Calendar, CalendarTick } from 'iconsax-react';

// ['Admin', 'Subscriber', 'Employee']
//
// Each item is shown to the user when:
//   1. authUserType ∈ allowed_to
//   2. AND one of:
//      - no permission constraint, OR
//      - user has wildcard '*', OR
//      - user has `permission` (single key), OR
//      - user has at least one of `permission_any_of` (array)

export const dashboardSideMenuItems = [
    // ═══════════════════════════════════════════
    // Section: Overview
    // ═══════════════════════════════════════════
    {
        section: 'Overview',
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Category />
    },
    {
        section: 'Overview',
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'AI Assistant',
        path: '/ai',
        icon: <Cpu />
    },
    {
        section: 'Overview',
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'Analytics',
        path: '/analytics',
        icon: <Chart2 />,
        permission_any_of: ['admin.analytics.view', 'analytics.view'],
    },

    // ═══════════════════════════════════════════
    // Section: System (Admin only)
    // ═══════════════════════════════════════════
    {
        section: 'System',
        allowed_to: ['Admin'],
        title: 'System Admins',
        path: '/system-admins',
        icon: <Profile2User />,
        permission: 'admin.system_admins.list'
    },
    {
        section: 'System',
        allowed_to: ['Admin'],
        title: 'Roles',
        path: '/roles/admins',
        icon: <Setting4 />,
        permission: 'admin.admin_roles.list'
    },
    {
        section: 'System',
        allowed_to: ['Admin'],
        title: 'Permissions',
        path: '/permissions/admins',
        icon: <Setting5 />,
        permission: 'admin.admin_permissions.list'
    },
    {
        section: 'System',
        allowed_to: ['Admin'],
        title: 'Industries',
        path: '/industries',
        icon: <Category2 />,
        permission: 'admin.industries.list'
    },

    // ═══════════════════════════════════════════
    // Section: Subscribers & Plans (Admin only)
    // ═══════════════════════════════════════════
    {
        section: 'Subscribers & Plans',
        allowed_to: ['Admin'],
        title: 'Subscribers',
        path: '/subscribers',
        icon: <Tag />,
        permission: 'admin.subscribers.list'
    },
    {
        section: 'Subscribers & Plans',
        allowed_to: ['Admin'],
        title: 'Plans',
        path: '/plans',
        icon: <PercentageCircle />,
        permission: 'admin.subscription_plans.list',
        children: [
            {
                title: 'Subscription Plans',
                path: '/plans',
                permission: 'admin.subscription_plans.list',
            },
            {
                title: 'AI Token Plans',
                path: '/plans/ai-plans',
                permission: 'admin.subscription_plans.list',
            },
        ]
    },

    // ═══════════════════════════════════════════
    // Section: Finance (Admin only)
    // ═══════════════════════════════════════════
    {
        section: 'Finance',
        allowed_to: ['Admin'],
        title: 'Money Receiving Methods',
        path: '/money-receiving',
        icon: <EmptyWallet />
    },

    // ═══════════════════════════════════════════
    // Section: HR (Subscriber & Employee)
    // ═══════════════════════════════════════════
    {
        section: 'HR',
        allowed_to: ['Subscriber', 'Employee'],
        title: 'HR Management',
        path: '/hr',
        icon: <Profile2User />,
        permission_any_of: [
            'employee_details.list',
            'departments.list',
            'positions.list',
            'attendances.track_all',
            'attendances.track_department',
            'leaves.track_all',
            'leaves.track_department',
            'salary_transactions.track_all',
            'salary_transactions.track_department',
            'employee_requests.track_all',
            'employee_requests.track_department',
        ],
        children: [
            {
                title: 'Employees',
                path: '/hr/employees',
                permission_any_of: ['employee_details.list'],
            },
            {
                title: 'Departments',
                path: '/hr/departments',
                permission_any_of: ['departments.list'],
            },
            {
                title: 'Teams',
                path: '/hr/teams',
                permission_any_of: ['teams.list'],
            },
            {
                title: 'Positions',
                path: '/hr/positions',
                permission_any_of: ['positions.list'],
            },
            {
                title: 'Meetings',
                path: '/hr/meetings',
                permission_any_of: ['meetings.list'],
            },
            {
                title: 'Holidays',
                path: '/hr/holidays',
                permission_any_of: ['holidays.list'],
            },
            {
                allowed_to: ['Employee'],
                title: 'Attendances',
                path: '/hr/attendances',
                permission_any_of: ['attendances.track_all', 'attendances.track_department'],
            },
            {
                allowed_to: ['Employee'],
                title: 'Leaves',
                path: '/hr/leaves',
                permission_any_of: ['leaves.track_all', 'leaves.track_department'],
            },
            {
                allowed_to: ['Employee'],
                title: 'Salary',
                path: '/hr/salary',
                permission_any_of: ['salary_transactions.track_all', 'salary_transactions.track_department'],
            },
            {
                allowed_to: ['Employee'],
                title: 'Requests',
                path: '/hr/requests',
                permission_any_of: ['employee_requests.track_all', 'employee_requests.track_department'],
            },
        ]
    },

    // ═══════════════════════════════════════════
    // Section: Operations (Subscriber & Employee)
    // ═══════════════════════════════════════════
    {
        section: 'Operations',
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Tasks',
        path: '/tasks',
        icon: <TaskSquare />,
        permission_any_of: ['tasks.track_all', 'tasks.track_department'],
    },
    {
        section: 'Operations',
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Projects',
        path: '/projects',
        icon: <NoteText />,
        permission_any_of: ['projects.track_all', 'projects.track_department'],
    },
    {
        section: 'Operations',
        allowed_to: ['Subscriber'],
        title: 'Agenda',
        path: '/appointments',
        icon: <CalendarTick />,
        permission_any_of: ['appointments.track_all', 'appointments.track_department'],
    },

    // ═══════════════════════════════════════════
    // Section: My Work (Employee only)
    // ═══════════════════════════════════════════
    {
        section: 'My Work',
        allowed_to: ['Employee'],
        title: 'My Tasks',
        path: '/employee/tasks',
        icon: <TaskSquare />,
    },
    {
        section: 'My Work',
        allowed_to: ['Employee'],
        title: 'My Projects',
        path: '/employee/projects',
        icon: <NoteText />,
    },
    {
        section: 'My Work',
        allowed_to: ['Employee'],
        title: 'My Agenda',
        path: '/appointments',
        icon: <CalendarTick />,
    },
    {
        section: 'My Work',
        allowed_to: ['Employee'],
        title: 'Attendance',
        path: '/attendance',
        icon: <Calendar />
    },
    {
        section: 'My Work',
        allowed_to: ['Employee'],
        title: 'Salary',
        path: '/salary',
        icon: <EmptyWallet />
    },
    {
        section: 'My Work',
        allowed_to: ['Employee'],
        title: 'Short Leaves',
        path: '/leaves',
        icon: <Stickynote size={20} />
    },
    {
        section: 'My Work',
        allowed_to: ['Employee'],
        title: 'Requests',
        path: '/requests',
        icon: <Stickynote />
    },

    // ═══════════════════════════════════════════
    // Section: Billing (Subscriber only)
    // ═══════════════════════════════════════════
    {
        section: 'Billing',
        allowed_to: ['Subscriber'],
        title: 'Subscriptions',
        path: '/subscriptions',
        icon: <ReceiptText />
    },

    // ═══════════════════════════════════════════
    // Section: Communication
    // ═══════════════════════════════════════════
    {
        section: 'Communication',
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Conversations',
        path: '/conversations',
        icon: <Messages1 />
    },
    {
        section: 'Communication',
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Social Media',
        path: '/social-media',
        icon: <Share />,
        permission_any_of: ['social_media_accounts.list'],
    },

    // ═══════════════════════════════════════════
    // Section: Support
    // ═══════════════════════════════════════════
    {
        section: 'Support',
        allowed_to: ['Admin', 'Subscriber'],
        title: 'Support Tickets',
        path: '/support-tickets',
        icon: <Messages1 />,
        permission: 'admin.support_tickets.list'
    },

    // ═══════════════════════════════════════════
    // Section: Administration (Subscriber & Employee)
    // ═══════════════════════════════════════════
    {
        section: 'Administration',
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Roles',
        path: '/roles/employees',
        icon: <Setting4 />,
        permission_any_of: ['roles.list'],
    },
    {
        section: 'Administration',
        allowed_to: ['Subscriber'],
        title: 'Permissions',
        path: '/permissions',
        icon: <Setting5 />
    },

    // ═══════════════════════════════════════════
    // Section: Settings
    // ═══════════════════════════════════════════
    {
        section: 'Settings',
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'Settings',
        path: '/setting',
        icon: <Setting />
    },
];
