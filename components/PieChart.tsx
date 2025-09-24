import React from 'react';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
}

const getCoordinatesForPercent = (percent: number, radius: number) => {
    const x = radius * Math.cos(2 * Math.PI * percent);
    const y = radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
};

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const size = 150;
    const radius = size / 2;
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    if (totalValue === 0) {
        return (
            <div className="flex items-center justify-center rounded-full bg-gray-200" style={{ width: size, height: size }}>
                <p className="text-xs text-center text-gray-500 p-2">Play a round to see your topic mix!</p>
            </div>
        );
    }
    
    let cumulativePercent = 0;

    return (
        <svg height={size} width={size} viewBox={`-${radius} -${radius} ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
            {data.map(({ name, value, color }) => {
                const percent = value / totalValue;
                const [startX, startY] = getCoordinatesForPercent(cumulativePercent, radius);
                cumulativePercent += percent;
                const [endX, endY] = getCoordinatesForPercent(cumulativePercent, radius);
                const largeArcFlag = percent > 0.5 ? 1 : 0;

                const pathData = [
                    `M ${startX} ${startY}`, // Move
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                    `L 0 0`, // Line to center
                ].join(' ');

                return <path key={name} d={pathData} fill={color} />;
            })}
        </svg>
    );
};

export default PieChart;
