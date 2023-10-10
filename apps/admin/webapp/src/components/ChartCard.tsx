import React, { ReactNode } from 'react';

type ChartCardProps = {
    title: string;
    children: ReactNode;
    date_range: string;
}

function ChartCard({ title, children, date_range }: ChartCardProps) {
    return (
        <div className="p-10 border border-gray-700 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-[#0b0b0b] w-full">
            <h2 className="text-white mb-1 text-lg">{title}</h2>
            <p className="text-gray-400 text-xs mb-4">Over {date_range}</p>
            {children}
        </div>
    );
}

export default ChartCard;
