import React from 'react';

interface RadarData {
  economy: number;
  security: number;
  healthcare: number;
  education: number;
  infrastructure: number;
  integrity: number;
}

interface RadarChartProps {
  data: RadarData;
  size?: number;
  color?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 240,
  color = '#00E676',
}) => {
  const axes = [
    { key: 'economy', label: 'Economy', val: data.economy },
    { key: 'security', label: 'Security', val: data.security },
    { key: 'healthcare', label: 'Health', val: data.healthcare },
    { key: 'education', label: 'Education', val: data.education },
    { key: 'infrastructure', label: 'Infra', val: data.infrastructure },
    { key: 'integrity', label: 'Integrity', val: data.integrity },
  ];

  const center = size / 2;
  const radius = (size / 2) - 35;
  const angleStep = (Math.PI * 2) / axes.length;

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1];

  const getCoordinates = (angle: number, distance: number) => {
    return {
      x: center + distance * Math.cos(angle - Math.PI / 2),
      y: center + distance * Math.sin(angle - Math.PI / 2),
    };
  };

  const dataPoints = axes.map((axis, i) => {
    const angle = i * angleStep;
    const distance = (axis.val / 100) * radius;
    return getCoordinates(angle, distance);
  });

  const polygonPath = dataPoints.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '') + ' Z';

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </radialGradient>
        </defs>

        {/* Concentric Polygons */}
        {levels.map((lvl, idx) => {
          const gridPoints = axes.map((_, i) => {
            const angle = i * angleStep;
            return getCoordinates(angle, radius * lvl);
          });
          const gridPath = gridPoints.reduce((acc, p, i) => {
            return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
          }, '') + ' Z';

          return (
            <path
              key={`grid-${idx}`}
              d={gridPath}
              fill={idx === levels.length - 1 ? 'rgba(255,255,255,0.015)' : 'none'}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={1}
              strokeDasharray={idx < levels.length - 1 ? '2 2' : undefined}
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((_, i) => {
          const angle = i * angleStep;
          const end = getCoordinates(angle, radius);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth={1}
            />
          );
        })}

        {/* Data Shape */}
        <path
          d={polygonPath}
          fill="url(#radar-glow)"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Vertices */}
        {dataPoints.map((p, i) => (
          <g key={`point-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={color}
              stroke="#08090C"
              strokeWidth={1.5}
            />
          </g>
        ))}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const angle = i * angleStep;
          const labelPoint = getCoordinates(angle, radius + 20);
          return (
            <text
              key={`label-${i}`}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-medium fill-slate-400"
            >
              {axis.label}
              <tspan className="text-[10px] font-semibold fill-[#00E676] ml-1">
                {` ${Math.round(axis.val)}%`}
              </tspan>
            </text>
          );
        })}
      </svg>
    </div>
  );
};
