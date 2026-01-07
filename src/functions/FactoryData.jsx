import { getTimeDifference } from "./Days.js";
const members = [
    {
        name: "Bob Brown",
        imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
    },
    {
        name: "Alice Johnson",
        imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
    },
    {
        name: "Bob Brown",
        imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
    },
    {
        name: "Alice Johnson",
        imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
    },
]

const tasksRows = [
    {
        id: "1",
        title: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/tasks/pulse_dashboard",
        members: members,
        maxVisibleMembers: 3,
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        dateStart: "2025-01-16T10:00:00",
        dateEnd: "2025-01-16T10:00:00",
        priority: { type: "Medium", title: "Medium" },
        status: { type: "Scheduled", title: "Scheduled" },
    },
    {
        id: "2",
        title: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/tasks/pulse_dashboard",
        members: members,
        maxVisibleMembers: 3,
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        dateStart: "2025-01-16T10:00:00",
        dateEnd: "2025-01-16T10:00:00",
        priority: { type: "Low", title: "Low" },
        status: { type: "Delayed", title: "Delayed" },
    },
    {
        id: "3",
        title: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/tasks/pulse_dashboard",
        members: members,
        maxVisibleMembers: 3,
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        dateStart: "2025-01-16T10:00:00",
        dateEnd: "2025-01-16T10:00:00",
        priority: { type: "High", title: "High" },
        status: { type: "Inactive", title: "Inactive" },
    },
    {
        id: "4",
        title: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/tasks/pulse_dashboard",
        members: members,
        maxVisibleMembers: 3,
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        dateStart: "2025-01-16T10:00:00",
        dateEnd: "2025-01-16T10:00:00",
        priority: { type: "Urgent", title: "Urgent" },
        status: { type: "Active", title: "Active" },
    }
];
const date1 = "2025-01-15T14:30:00";
const date2 = "2025-01-13T13:40:00";
const tasks = [
    {
        name: "Design Website Layout",
        members: [
            {
                name: "John Doe",
                imageProfile: "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg",
            },
            {
                name: "Jane Smith",
                imageProfile: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
            },
            {
                name: "Alice Johnson",
                imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
            },
        ],
        delivery: "Delayed",
        rate: null,
        assignedDate: "2025-01-15T14:30:00", // جديد
        dueDate: "2025-01-20T13:40:00", // جديد
        deadLine: "2025-01-19T23:59:59", // جديد
        startDate: "2025-01-10T09:00:00", // جديد
        department: "Design", // جديد
    },
    {
        name: "Implement Backend APIs",
        members: [
            {
                name: "Bob Brown",
                imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
            },
            {
                name: "Alice Johnson",
                imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
            },
            {
                name: "Bob Brown",
                imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
            },
            {
                name: "Alice Johnson",
                imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
            },
        ],
        delivery: "late",
        timeLate: getTimeDifference(date1, date2), // لا تغييرات
        rate: 2,
        assignedDate: "2025-01-14T10:00:00", // جديد
        dueDate: "2025-01-18T16:00:00", // جديد
        deadLine: "2025-01-17T23:59:59", // جديد
        startDate: "2025-01-12T08:30:00", // جديد
        department: "Backend Development", // جديد
    },
    {
        name: "Perform QA Testing",
        members: [
            {
                name: "Jane Smith",
                imageProfile: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
            },
            {
                name: "Bob Brown",
                imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
            },
        ],
        delivery: "Delayed",
        rate: 4.5,
        assignedDate: "2025-01-16T14:00:00",
        dueDate: "2025-01-22T12:00:00",
        deadLine: "2025-01-21T23:59:59",
        startDate: "2025-01-15T11:00:00",
        department: "QA",
    },
];

const comments = [
    {
        account: members[0], // أول عضو
        timeAgo: '2025-01-12T08:00:00', // تاريخ محدد
        text: "Great progress on the project so far!",
        images: [
            "https://i.cdn.turner.com/dr/cnnarabic/cnnarabic/release/sites/default/files/styles/landscape_780x440/public/image/1_6.JPG?itok=pmNMX7TP", // رابط صورة للتعليق
        ],
    },
    {
        account: members[1], // ثاني عضو
        timeAgo: '2025-01-11T10:00:00', // تاريخ محدد
        text: "We need to discuss the timeline adjustments.",
        images: [
            "https://res.cloudinary.com/dw4e01qx8/f_auto,q_auto/images/gogxbp2tjsjvbnas7ygk", // رابط صورة للتعليق
            "https://res.cloudinary.com/dw4e01qx8/f_auto,q_auto/images/jfj1ro8ejfzmojl6k75w",
        ],
    },
    {
        account: members[2], // ثالث عضو
        timeAgo: '2025-01-10T09:30:00', // تاريخ محدد
        text: "Please review the design drafts I shared.",
        images: [],
    },
    {
        account: members[3], // رابع عضو
        timeAgo: '2025-01-12T15:00:00', // تاريخ محدد
        text: "Testing has uncovered some critical issues.",
        images: [
            "https://images.adsttc.com/media/images/5c6e/5b10/284d/d151/2900/06ab/medium_jpg/L4979_N41_hd.jpg?1550736130",
        ],
    },
];




const attachments = [
    {
        name: "Project_Plan.pdf",
        size: "2.4 MB",
        type: "pdf" // نوع الملف لتحديد الأيقونة
    },
    {
        name: "UI_Design.png",
        size: "1.2 MB",
        type: "image" // نوع الملف لتحديد الأيقونة
    },
    {
        name: "Team_Meeting.mp4",
        size: "15 MB",
        type: "video" // نوع الملف لتحديد الأيقونة
    },
    {
        name: "Documentation.docx",
        size: "500 KB",
        type: "document" // نوع الملف الافتراضي
    }
];

const activityLogs = [
    {
        type: "add",
        title: "New task added",
        description: "John Doe added a new task: Design website layout.",
        timeAgo: "2025-01-13T14:00:00.000Z",
    },
    {
        type: "video",
        title: "Meeting scheduled",
        description: "Bob Brown added a comment to the task: Perform QA Testing.",
        timeAgo: "2025-01-13T11:00:00.000Z",
    },
    {
        type: "uploaded",
        title: "File uploaded",
        description: "Jane Smith uploaded 'UI_Design.png' to the project.",
        timeAgo: "2025-01-12T16:00:00.000Z",
    },
    {
        type: "check",
        title: "Task completed",
        description: "Alice Johnson marked the task 'Implement Backend APIs' as complete.",
        timeAgo: "2025-01-10T16:00:00.000Z",
    },
    {
        type: "add",
        title: "New task added",
        description: "Bob Brown added a comment to the task: Perform QA Testing.",
        timeAgo: "2025-01-13T11:00:00.000Z",
    },
];

const filterOptions = [
    { id: "deadLine", name: "dead line" },
    { id: "startDate", name: "start date" },
    { id: "department", name: "department" }
]


const projects = [
    {
        id: "1",
        name: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/projects/pulse_dashboard_project",
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        date: "2025-01-16T10:00:00",
        priority: { type: "Urgent", title: "Urgent" },
        status: { type: "Active", title: "Active" },
        count: 5
    },
    {
        id: "2",
        name: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/projects/pulse_dashboard_project",
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        date: "2025-01-16T10:00:00",
        priority: { type: "High", title: "High" },
        status: { type: "Inactive", title: "Inactive" },
        count: 5
    },
    {
        id: "3",
        name: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/projects/pulse_dashboard_project",
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        date: "2025-01-16T10:00:00",
        priority: { type: "Low", title: "Low" },
        status: { type: "Delayed", title: "Delayed" },
        count: 5
    },
    {
        id: "4",
        name: "Pulse Dashboard",
        description: "Developing a dashboard for real-time performance.",
        path: "/projects/pulse_dashboard_project",
        account: {
            name: "Fatma Ahmed Moh",
            rule: "Product Manager",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        date: "2025-01-16T10:00:00",
        priority: { type: "Medium", title: "Medium" },
        status: { type: "Scheduled", title: "Scheduled" },
        count: 5
    }
];


const employeesFactory = [
    {
        id: "1",
        name: "Fatma Ahmed Moh",
        email: "fatma@gmail.com",
        role: "Product Manager",
        department: "Publishing",
        jobType: "Full-time",
        salary: "1500",
        rating: 90,
        imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
    },
    {
        id: "2",
        name: "Ali Hassan",
        email: "alihassan@gmail.com",
        role: "Software Engineer",
        department: "Development",
        jobType: "Full-time",
        salary: "2500",
        rating: 80,
        imageProfile: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        id: "3",
        name: "Sara Khaled",
        email: "sarakha@gmail.com",
        role: "UX Designer",
        department: "Design",
        jobType: "Part-time",
        salary: "1800",
        rating: 85,
        imageProfile: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
        id: "5",
        name: "Fatma Ahmed Moh",
        email: "fatmaahmed@gmail.com",
        role: "Product Manager",
        department: "Publishing",
        jobType: "Full-time",
        salary: "1500",
        rating: 90,
        imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
    },
    {
        id: "6",
        name: "Ali Hassan",
        role: "Software Engineer",
        email: "ali@gmail.com",
        department: "Development",
        jobType: "Full-time",
        salary: "2500",
        rating: 80,
        imageProfile: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        id: "7",
        name: "Sara Khaled",
        email: "saraa@gmail.com",
        role: "UX Designer",
        department: "Design",
        jobType: "Part-time",
        salary: "1800",
        rating: 85,
        imageProfile: "https://randomuser.me/api/portraits/women/2.jpg"
    }
];

export const departments = [
    { value: "all", name: "Departments" },
    { value: "Development", name: "Development" },
    { value: "Design", name: "Design" },
    { value: "Publishing", name: "Publishing" },
];
export const defaultStatusOptions = [
    { value: "all", name: "Status" },
    { value: "ontime", name: "On Time" },
    { value: "late", name: "Late" },
    { value: "absent", name: "Absent" },
];

export const MoanyReceivingMethods = [
    {
        "_id": 1,
        "name": "Online Payment",
        "type": "Credit Card",
        "provider": "Master Card",
        "currency": "USD",
        "added_at": "May 24, 2025",
        "status": "active",
        "default_status": ""
    },
    {
        "_id": 2,
        "name": "Online Payment",
        "type": "Credit Card",
        "provider": "Master Card",
        "currency": "USD",
        "added_at": "May 24, 2025",
        "status": "in-active",
        "default_status": ""
    },
    {
        "_id": 3,
        "name": "Online Payment",
        "type": "Credit Card",
        "provider": "Master Card",
        "currency": "USD",
        "added_at": "May 24, 2025",
        "status": "active",
        "default_status": ""
    },
    {
        "_id": 4,
        "name": "Online Payment",
        "type": "Credit Card",
        "provider": "Master Card",
        "currency": "USD",
        "added_at": "May 24, 2025",
        "status": "in-active",
        "default_status": ""
    },
    {
        "_id": 5,
        "name": "Online Payment",
        "type": "Credit Card",
        "provider": "Master Card",
        "currency": "USD",
        "added_at": "May 24, 2025",
        "status": "Active",
        "default_status": "default"
    },
    {
        "_id": 6,
        "name": "Online Payment",
        "type": "Credit Card",
        "provider": "Master Card",
        "currency": "USD",
        "added_at": "May 24, 2025",
        "status": "Not-active",
        "default_status": ""
    },
    {
        "_id": 7,
        "name": "Bank Transfer",
        "type": "Account",
        "provider": "Local Bank",
        "currency": "EUR",
        "added_at": "June 01, 2025",
        "status": "active",
        "default_status": ""
    },
    {
        "_id": 8,
        "name": "Digital Wallet",
        "type": "E-Wallet",
        "provider": "PayPal",
        "currency": "USD",
        "added_at": "April 15, 2025",
        "status": "active",
        "default_status": "default"
    }
]

export const companyList = [
    {
        "subscriber_details": {
            "name": "Ahmed Ibrahim",
            "subscribed_at": "Jan 15, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo1.png"
        },
        "product_manager": "Project Manager",
        "company_name": "TechSolutions",
        "company_website": "techsolutions.com",
        "industry": "Technology",
        "users": 12000,
        "status": "Active"
    },
    {
        "subscriber_details": {
            "name": "Layla Khaled",
            "subscribed_at": "Feb 28, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo2.png"
        },
        "product_manager": "Operations Lead",
        "company_name": "HealthCorp",
        "company_website": "healthcorp.org",
        "industry": "Healthcare",
        "users": 5600,
        "status": "In-active"
    },
    {
        "subscriber_details": {
            "name": "Omar Mustafa",
            "subscribed_at": "Mar 10, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo3.png"
        },
        "product_manager": "Marketing Director",
        "company_name": "RetailPros",
        "company_website": "retailpros.net",
        "industry": "Retail",
        "users": 89000,
        "status": "Active"
    },
    {
        "subscriber_details": {
            "name": "Sara Ali",
            "subscribed_at": "Apr 01, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo4.png"
        },
        "product_manager": "Finance Analyst",
        "company_name": "GlobalFinance",
        "company_website": "globalfinance.com",
        "industry": "Fintech",
        "users": 3400,
        "status": "Active"
    },
    {
        "subscriber_details": {
            "name": "Youssef Hamed",
            "subscribed_at": "May 05, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo5.png"
        },
        "product_manager": "Software Engineer",
        "company_name": "CodeBuilders",
        "company_website": "codebuilders.io",
        "industry": "Software",
        "users": 750,
        "status": "In-active"
    },
    {
        "subscriber_details": {
            "name": "Nour Tamer",
            "subscribed_at": "Jun 20, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo6.png"
        },
        "product_manager": "HR Manager",
        "company_name": "PeopleFirst",
        "company_website": "peoplefirst.net",
        "industry": "Human Resources",
        "users": 21000,
        "status": "Active"
    },
    {
        "subscriber_details": {
            "name": "Karim Saeed",
            "subscribed_at": "Jul 12, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo7.png"
        },
        "product_manager": "Sales Director",
        "company_name": "SalesGenius",
        "company_website": "salesgenius.com",
        "industry": "Sales",
        "users": 4000,
        "status": "In-active"
    },
    {
        "subscriber_details": {
            "name": "Hana Mostafa",
            "subscribed_at": "Aug 30, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo8.png"
        },
        "product_manager": "UX Designer",
        "company_name": "DesignStudio",
        "company_website": "designstudio.io",
        "industry": "Design",
        "users": 980,
        "status": "Active"
    },
    {
        "subscriber_details": {
            "name": "Adel Fahmy",
            "subscribed_at": "Sep 14, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo9.png"
        },
        "product_manager": "IT Manager",
        "company_name": "NetSecure",
        "company_website": "netsecure.org",
        "industry": "Cybersecurity",
        "users": 15000,
        "status": "Active"
    },
    {
        "subscriber_details": {
            "name": "Mona Wahba",
            "subscribed_at": "Oct 1, 2025",
            "plan": "Basic plan",
            "logo": "http://example.com/logo10.png"
        },
        "product_manager": "Content Strategist",
        "company_name": "ContentCreators",
        "company_website": "contentcreators.net",
        "industry": "Media",
        "users": 6700,
        "status": "In-active"
    }
]

const departmentsFactory = [
    {
        "id": "1",
        "name": "Publishing Solutions Department",
        "stats": {
            "projects_count": 3,
            "tasks_count": 5,
            "employees_count": 35
        }
    },
    {
        "id": "2",
        "name": "Content Management Team",
        "icon": "https://api.dicebear.com/7.x/identicon/svg?seed=cont",
        "stats": {
            "projects_count": 4,
            "tasks_count": 10,
            "employees_count": 30
        }
    },
    {
        "id": "3",
        "name": "Digital Publishing Division",
        "icon": "https://api.dicebear.com/7.x/identicon/svg?seed=digi",
        "stats": {
            "projects_count": 7,
            "tasks_count": 30,
            "employees_count": 40
        }
    },
    {
        "id": "4",
        "name": "Editorial Software Group",
        "icon": "https://api.dicebear.com/7.x/identicon/svg?seed=edit",
        "stats": {
            "projects_count": 8,
            "tasks_count": 15,
            "employees_count": 20
        }
    },
    {
        "id": "5",
        "name": "Publishing",
        "icon": "https://api.dicebear.com/7.x/identicon/svg?seed=p",
        "stats": {
            "projects_count": 9,
            "tasks_count": 20,
            "employees_count": 50
        }
    },
    {
        "id": "6",
        "name": "Media Production Team",
        "icon": "https://api.dicebear.com/7.x/identicon/svg?seed=media",
        "stats": {
            "projects_count": 11,
            "tasks_count": 25,
            "employees_count": 24
        }
    },
    {
        "id": "7",
        "name": "Creative Publishing Unit",
        "icon": "https://api.dicebear.com/7.x/identicon/svg?seed=create",
        "stats": {
            "projects_count": 13,
            "tasks_count": 30,
            "employees_count": 10
        }
    }
]



const teamsFactory = [
    {
        id: "1",
        name: "Software Team",
        icon: "https://api.dicebear.com/7.x/identicon/svg?seed=soft",
        relatedModel: {
            name: "Publishing Solutions Department",
            type: "Department", // Optional: to distinguish type if needed
            image: "https://api.dicebear.com/7.x/identicon/svg?seed=pub"
        },
        department: "Publishing Solutions Department", // Keep for backward compatibility if needed, or remove
        leader: {
            name: "Fatma Ahmed",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        members: [
            { imageProfile: "https://randomuser.me/api/portraits/men/1.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/women/2.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/men/3.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/women/4.jpg" }
        ],
        members_count: 9, // Additional members count
        projects_count: 35,
        tasks_count: 35,
        employees_count: 35,
        score: 4.5
    },
    {
        id: "2",
        name: "Software Team",
        icon: "https://api.dicebear.com/7.x/identicon/svg?seed=soft2",
        relatedModel: {
            name: "Pulse Dashboard",
            type: "Project",
            typeSubtitle: "Developing a dashboard for...",
            image: "https://api.dicebear.com/7.x/identicon/svg?seed=pulse"
        },
        department: "Development",
        leader: {
            name: "Fatma Ahmed",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        members: [
            { imageProfile: "https://randomuser.me/api/portraits/men/5.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/women/6.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/men/7.jpg" }
        ],
        members_count: 9,
        projects_count: 35,
        tasks_count: 35,
        employees_count: 35,
        score: 4.8
    },
    {
        id: "3",
        name: "Software Team",
        icon: "https://api.dicebear.com/7.x/identicon/svg?seed=soft3",
        relatedModel: {
            name: "Publishing Solutions Dept...",
            type: "Department",
            image: "https://api.dicebear.com/7.x/identicon/svg?seed=pub2"
        },
        department: "Design",
        leader: {
            name: "Fatma Ahmed",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        members: [
            { imageProfile: "https://randomuser.me/api/portraits/women/8.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/men/9.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/women/10.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/men/11.jpg" }
        ],
        members_count: 9,
        projects_count: 35,
        tasks_count: 35,
        employees_count: 35,
        score: 4.2
    },
    {
        id: "4",
        name: "Software Team",
        icon: "https://api.dicebear.com/7.x/identicon/svg?seed=soft4",
        relatedModel: {
            name: "Publishing Solutions Dept...",
            type: "Department",
            image: "https://api.dicebear.com/7.x/identicon/svg?seed=pub3"
        },
        department: "Publishing",
        leader: {
            name: "Fatma Ahmed",
            imageProfile: "https://images.squarespace-cdn.com/content/v1/58865912a5790a87a29447e5/1501777422700-0WW6HYF16XLP8ZTJ0PMU/Image+Profile+Photography2.jpg"
        },
        members: [
            { imageProfile: "https://randomuser.me/api/portraits/men/12.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/women/13.jpg" },
            { imageProfile: "https://randomuser.me/api/portraits/men/14.jpg" }
        ],
        members_count: 9,
        projects_count: 35,
        tasks_count: 35,
        employees_count: 35,
        score: 4.9
    }
];

export {
    tasks, date1, date2,
    members,
    activityLogs, comments, attachments,
    filterOptions, employeesFactory, projects, tasksRows, departmentsFactory, teamsFactory
}