// dashboardSideMenuItems.js
import { Setting, Edit, Share, Messages1, Category, Profile2User, TaskSquare, NoteText, Chart2, Cpu, PercentageCircle, Buildings, Stickynote, Setting4, Setting5, ReceiptText, Category2, Tag, EmptyWallet, Calendar } from 'iconsax-react';

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
        icon: <Profile2User />,
        permission: 'admin.system_admins.list'
    },
    {
        allowed_to: ['Admin'],
        title: 'Roles',
        path: '/roles/admins',
        icon: <Setting4 />,
        permission: 'admin.admin_roles.list'
    },
    {
        allowed_to: ['Admin'],
        title: 'Permissions',
        path: '/permissions/admins',
        icon: <Setting5 />,
        permission: 'admin.admin_permissions.list'
    },
    {
        allowed_to: ['Admin'],
        title: 'Industries',
        path: '/industries',
        icon: <Category2 />,
        permission: 'admin.industries.list'
    },
    {
        allowed_to: ['Subscriber'],
        title: 'Subscriptions',
        path: '/subscriptions',
        icon: <ReceiptText />
    },
    {
        // HR Management is shown to Subscriber (always) and to Employees who
        // have at least one HR-management permission (track_all/track_department).
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
                title: 'Positions',
                path: '/hr/positions',
                permission_any_of: ['positions.list'],
            },
            {
                title: 'Attendances',
                path: '/hr/attendances',
                permission_any_of: ['attendances.track_all', 'attendances.track_department'],
            },
            {
                title: 'Leaves',
                path: '/hr/leaves',
                permission_any_of: ['leaves.track_all', 'leaves.track_department'],
            },
            {
                title: 'Salary',
                path: '/hr/salary',
                permission_any_of: ['salary_transactions.track_all', 'salary_transactions.track_department'],
            },
            {
                title: 'Requests',
                path: '/hr/requests',
                permission_any_of: ['employee_requests.track_all', 'employee_requests.track_department'],
            },
        ]
    },
    {
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Roles',
        path: '/roles/employees',
        icon: <Setting4 />,
        permission_any_of: ['roles.list'],
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
        icon: <Chart2 />,
        permission_any_of: ['admin.analytics.view', 'analytics.view'],
    },
    {
        allowed_to: ['Admin'],
        title: 'Subscribers',
        path: '/subscribers',
        icon: <Tag />,
        permission: 'admin.subscribers.list'
    },
    {
        allowed_to: ['Admin'],
        title: 'Plans',
        path: '/plans',
        icon: <PercentageCircle />,
        permission: 'admin.subscription_plans.list'
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
        icon: <TaskSquare />,
        permission_any_of: ['tasks.track_all', 'tasks.track_department'],
    },
    {
        allowed_to: ['Employee'],
        title: 'My Tasks',
        path: '/employee/tasks',
        icon: <TaskSquare />,
    },
    // ── Personal employee routes (always visible to Employees) ──────
    {
        allowed_to: ['Employee'],
        title: 'Salary',
        path: '/salary',
        icon: <EmptyWallet />
    },
    {
        allowed_to: ['Employee'],
        title: 'Attendance',
        path: '/attendance',
        icon: <Calendar />
    },
    {
        allowed_to: ['Employee'],
        title: 'Short Leaves',
        path: '/leaves',
        icon: <Stickynote size={20} />
    },
    {
        allowed_to: ['Employee'],
        title: 'Requests',
        path: '/requests',
        icon: <Stickynote />
    },
    // ── Projects: Subscriber sees admin route; Employee sees personal,
    //    OR admin route if they have track_all/track_department.
    {
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Projects',
        path: '/projects',
        icon: <NoteText />,
        // For Subscriber: shown unconditionally (covered by wildcard).
        // For Employee: shown only if they have admin-scope permission.
        permission_any_of: ['projects.track_all', 'projects.track_department'],
    },
    {
        allowed_to: ['Employee'],
        title: 'My Projects',
        path: '/employee/projects',
        icon: <NoteText />
    },
    {
        allowed_to: ['Subscriber', 'Employee'],
        title: 'Conversations',
        path: '/conversations',
        icon: <Messages1 />
    },
    {
        allowed_to: ['Admin', 'Subscriber', 'Employee'],
        title: 'Settings',
        path: '/setting',
        icon: <Setting />
    },
    {
        allowed_to: ['Admin', 'Subscriber'],
        title: 'Support Tickets',
        path: '/support-tickets',
        icon: <Messages1 />,
        permission: 'admin.support_tickets.list'
    },
];
