import type { ReactNode } from 'react';
import { Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface QuickActionCardProps {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
}

/** Bordered white tile used in the Quick Actions grid: icon on top, label below. */
export function QuickActionCard({ icon, label, onPress }: QuickActionCardProps) {
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      android_ripple={{ color: '#f1f5f9' }}
      className="w-[31%] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-4 dark:border-slate-700 dark:bg-slate-900 shadow-sm shadow-slate-100 dark:shadow-none"
    >
      {icon}
      <Text className="text-center text-xs font-semibold text-ink dark:text-white">{label}</Text>
    </AnimatedPressable>
  );
}
