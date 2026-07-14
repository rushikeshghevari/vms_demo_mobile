import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/providers/ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerTitle?: string;
  centerSubtitle?: string;
}

/**
 * Premium animated multi-segment Donut Chart using react-native-svg and react-native-reanimated.
 * Shows distribution of finances/statistics with a clean color legend.
 */
export function DonutChart({
  data,
  size = 140,
  strokeWidth = 14,
  centerTitle,
  centerSubtitle = 'Total',
}: DonutChartProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Filter out zero value segments to prevent rendering glitches
  const activeSegments = data.filter((item) => item.value > 0);
  const total = activeSegments.reduce((sum, item) => sum + item.value, 0);

  // Animation controller
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withTiming(1, { duration: 1000 });
  }, [total, animationProgress]);

  // If there is no data, render an empty state ring
  if (total === 0) {
    return (
      <View style={{ width: size, height: size }} className="items-center justify-center relative">
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-sm font-bold text-slate-400">No Data</Text>
        </View>
      </View>
    );
  }

  // Calculate cumulative angles for rotations
  let cumulativePercent = 0;
  const segmentsWithAngles = activeSegments.map((item) => {
    const percent = item.value / total;
    const startAngle = cumulativePercent * 360;
    cumulativePercent += percent;
    return { ...item, percent, startAngle };
  });

  return (
    <View className="flex-row items-center justify-between p-2">
      {/* Svg Donut Circle */}
      <View style={{ width: size, height: size }} className="items-center justify-center relative">
        <Svg width={size} height={size}>
          {/* Base Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Render Slices */}
          {segmentsWithAngles.map((item, index) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const animatedProps = useAnimatedProps(() => {
              const targetFill = item.percent * circumference;
              const animatedFill = targetFill * animationProgress.value;
              return {
                strokeDashoffset: circumference - animatedFill,
              };
            });

            return (
              <AnimatedCircle
                key={`${item.label}-${index}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                rotation={-90 + item.startAngle}
                originX={size / 2}
                originY={size / 2}
                strokeLinecap={activeSegments.length === 1 ? 'butt' : 'round'}
              />
            );
          })}
        </Svg>

        {/* Center Text Stats */}
        <View className="absolute inset-0 items-center justify-center flex-col">
          <Text className="text-lg font-bold text-ink dark:text-white leading-none">
            {centerTitle !== undefined ? centerTitle : total}
          </Text>
          <Text className="text-[10px] text-ink-muted dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">
            {centerSubtitle}
          </Text>
        </View>
      </View>

      {/* Legend list */}
      <View className="flex-1 ml-6 gap-2">
        {data.map((item, index) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <View key={`${item.label}-legend-${index}`} className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View style={{ backgroundColor: item.color }} className="w-2.5 h-2.5 rounded-full" />
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-300" numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
              <Text className="text-xs font-bold text-ink dark:text-white ml-2">
                {percent}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
