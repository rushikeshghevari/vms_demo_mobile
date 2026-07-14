import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export type StatusPillTheme = 'emerald' | 'blue' | 'amber' | 'rose' | 'violet' | 'slate';

interface StatusPillProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  themeColor?: StatusPillTheme;
  onPress?: () => void;
}

const THEME_CLASSES: Record<
  StatusPillTheme,
  { bg: string; border: string; strip: string; icon: string }
> = {
  emerald: {
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    border: 'border-emerald-100/50 dark:border-emerald-900/30',
    strip: 'bg-emerald-500',
    icon: '#10b981',
  },
  blue: {
    bg: 'bg-blue-50/60 dark:bg-blue-950/20',
    border: 'border-blue-100/50 dark:border-blue-900/30',
    strip: 'bg-blue-500',
    icon: '#3b82f6',
  },
  amber: {
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    border: 'border-amber-100/50 dark:border-amber-900/30',
    strip: 'bg-amber-500',
    icon: '#f59e0b',
  },
  rose: {
    bg: 'bg-rose-50/60 dark:bg-rose-950/20',
    border: 'border-rose-100/50 dark:border-rose-900/30',
    strip: 'bg-rose-500',
    icon: '#ef4444',
  },
  violet: {
    bg: 'bg-violet-50/60 dark:bg-violet-950/20',
    border: 'border-violet-100/50 dark:border-violet-900/30',
    strip: 'bg-violet-500',
    icon: '#8b5cf6',
  },
  slate: {
    bg: 'bg-slate-50/70 dark:bg-slate-800/30',
    border: 'border-slate-100 dark:border-slate-700/30',
    strip: 'bg-slate-400',
    icon: '#64748b',
  },
};

/**
 * Premium glassmorphic status badge.
 * Combines compact layout, colorful neon strips, and tactical spring rebounds.
 */
export function StatusPill({
  label,
  value,
  icon,
  themeColor = 'slate',
  onPress,
}: StatusPillProps) {
  const classes = THEME_CLASSES[themeColor];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center border rounded-2xl overflow-hidden pl-3.5 pr-4 py-3 bg-white dark:bg-slate-900 ${classes.bg} ${classes.border}`}
    >
      {/* Indicator Strip */}
      <View className={`absolute left-0 top-0 bottom-0 w-1.5 ${classes.strip}`} />

      {/* Main Row */}
      <View className="flex-row items-center flex-1 justify-between ml-1.5">
        <View className="flex-row items-center flex-1 pr-1.5">
          <Ionicons name={icon} size={16} color={classes.icon} style={{ marginRight: 6 }} />
          <Text className="text-[10px] font-bold text-slate-500 dark:text-slate-400" numberOfLines={1}>
            {label}
          </Text>
        </View>
        <Text className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
          {value}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
