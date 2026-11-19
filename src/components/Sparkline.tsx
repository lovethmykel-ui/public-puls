import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  isPositive?: boolean;
  strokeWidth?: number;
  showGradient?: boolean;
  showDot?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  color,
  isPositive = true,
  strokeWidth = 2,
  showGradient = true,
  showDot = true,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const paddingY = 4;
  const paddingX = 4;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * usableWidth;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const strokeColor = color || (isPositive ? '#00E676' : '#EF4444');
  const gradientId = `spark-grad-${Math.random().toString(36).substring(2, 9)}`;

  const lastPoint = points[points.length - 1];

  return (
    <div className="relative inline-block" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {showGradient && (
          <path d={areaD} fill={`url(#${gradientId})`} />
        )}

        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {showDot && (
          <>
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={3.5}
              fill={strokeColor}
              className="animate-pulse"
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={6.5}
              fill={strokeColor}
              opacity={0.3}
            />
          </>
        )}
      </svg>
    </div>
  );
};
