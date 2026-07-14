import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/providers/ThemeProvider';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number; // value between 0 and 1
  size?: number;
  strokeWidth?: number;
  activeColor?: string;
  backgroundColor?: string;
  label?: string;
}

/**
 * Modern vector-based circular progress gauge using react-native-svg and react-native-reanimated.
 * Features a spring-based stroke offset fill animation.
 */
export function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 8,
  activeColor = '#1e88e5',
  backgroundColor,
  label,
}: CircularProgressProps) {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useSharedValue(circumference);

  useEffect(() => {
    const targetOffset = circumference - Math.min(Math.max(progress, 0), 1) * circumference;
    strokeDashoffset.value = withSpring(targetOffset, { damping: 15, stiffness: 100 });
  }, [progress, circumference, strokeDashoffset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  const percentage = Math.round(Math.min(Math.max(progress, 0), 1) * 100);
  const trackStroke = backgroundColor || theme.colors.border;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center relative">
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background circular track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackStroke}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated progress track */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>

      {/* Central percentage stats display */}
      <View className="absolute inset-0 items-center justify-center flex-col">
        <Text className="text-sm font-bold text-ink dark:text-white leading-none">
          {percentage}%
        </Text>
        {label ? (
          <Text className="text-[9px] text-ink-muted dark:text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
