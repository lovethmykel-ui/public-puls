import React, { useId } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  isPositive?: boolean;
  strokeWidth?: number;
  showGradient?: boolean;
  showDot?: boolean;
  responsive?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 280,
  height = 64,
  color,
  isPositive = true,
  strokeWidth = 2.5,
  showGradient = true,
  showDot = true,
  responsive = false,
}) => {
  const rawId = useId();
  const gradientId = `spark-grad-${rawId.replace(/:/g, '')}`;

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const paddingY = 6;
  const paddingX = 6;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * usableWidth;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Smooth cubic bezier curve
  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + curr.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  const strokeColor = color || (isPositive ? '#00E676' : '#FF5232');
  const lastPoint = points[points.length - 1];

  return (
    <div
      className={responsive ? 'relative w-full' : 'relative inline-block'}
      style={responsive ? { height } : { width, height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className={responsive ? 'w-full h-full overflow-visible' : 'overflow-visible'}
        width={responsive ? undefined : width}
        height={responsive ? undefined : height}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.32} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {showGradient && <path d={areaD} fill={`url(#${gradientId})`} />}

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
              r={8}
              fill={strokeColor}
              opacity={0.22}
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={4}
              fill={strokeColor}
            />
          </>
        )}
      </svg>
    </div>
  );
};
