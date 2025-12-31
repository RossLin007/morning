
import React from 'react';

interface RadarChartProps {
  stats: number[]; // Array of 5 values (0-100)
  color?: string;
  labels?: string[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  stats, 
  color = "#6B8E8E", 
  labels = ["恒毅力", "智慧", "洞察", "影响", "专注"],
  size = 180
}) => {
    const numPoints = 5;
    const radius = 60;
    const center = 75; // Canvas viewBox is 150x150
    
    // Helper to calculate coordinates
    const getCoords = (value: number, index: number) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    // Generate Points string for SVG polygon
    const points = stats.map((val, i) => {
        const { x, y } = getCoords(val, i);
        return `${x},${y}`;
    }).join(' ');

    // Background Grid Levels
    const levels = [100, 75, 50, 25];
    
    // Label positions (Hardcoded specifically for pentagon layout)
    const labelPos = [
        { x: 75, y: 10 },
        { x: 140, y: 55 },
        { x: 120, y: 135 },
        { x: 30, y: 135 },
        { x: 10, y: 55 },
    ];

    return (
        <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
            <svg viewBox="0 0 150 150" className="overflow-visible w-full h-full">
                {/* Grid Lines */}
                {levels.map(level => {
                    const gridPoints = Array(numPoints).fill(level).map((v, i) => {
                        const { x, y } = getCoords(v, i);
                        return `${x},${y}`;
                    }).join(' ');
                    return (
                        <polygon key={level} points={gridPoints} fill="none" stroke="currentColor" strokeOpacity="0.1" className="text-gray-500" strokeWidth="1" />
                    );
                })}
                
                {/* Axis Lines */}
                {Array(numPoints).fill(0).map((_, i) => {
                    const { x, y } = getCoords(100, i);
                    return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.1" className="text-gray-500" strokeWidth="1" />;
                })}

                {/* The Data Shape */}
                <polygon points={points} fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" className="drop-shadow-sm transition-all duration-1000 ease-out" />
                
                {/* Data Points */}
                {stats.map((val, i) => {
                    const { x, y } = getCoords(val, i);
                    return <circle key={i} cx={x} cy={y} r="3" fill={color} className="transition-all duration-1000 ease-out" />;
                })}
            </svg>
            
            {/* Labels overlay */}
            {labels.map((text, i) => (
                <div 
                    key={i} 
                    className="absolute text-[10px] font-bold text-gray-400 uppercase tracking-wide transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: (labelPos[i].x / 150) * 100 + '%', top: (labelPos[i].y / 150) * 100 + '%' }}
                >
                    {text}
                </div>
            ))}
        </div>
    );
};
