"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { name: 'Jan', onTime: 60, late: 40 },
    { name: 'Feb', onTime: 80, late: 50 },
    { name: 'Mar', onTime: 45, late: 30 },
    { name: 'Apr', onTime: 70, late: 90 },
    { name: 'May', onTime: 65, late: 25 },
    { name: 'Jun', onTime: 75, late: 45 },
];

const DepartmentsPerformanceChat = ({ data = [] }) => (
    <div className="w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend iconType="circle" verticalAlign="bottom" height={36} />
                <Bar dataKey="rate" fill="#375DFB" radius={[15, 15, 0, 0]} barSize={25} name="Department Rating" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default DepartmentsPerformanceChat;