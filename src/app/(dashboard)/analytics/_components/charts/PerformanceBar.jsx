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

const PerformanceBar = () => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Legend iconType="circle" verticalAlign="bottom" height={36}/>
            <Bar dataKey="onTime" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} name="On-Time Completed" />
            <Bar dataKey="late" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={12} name="Late Completed" />
        </BarChart>
    </ResponsiveContainer>
);

export default PerformanceBar;