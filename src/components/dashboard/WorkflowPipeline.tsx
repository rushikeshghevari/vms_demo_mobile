import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export interface PipelineStep {
  id: string;
  title: string;
  subtitle?: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  onPress?: () => void;
}

interface WorkflowPipelineProps {
  steps: PipelineStep[];
  title?: string;
}

/**
 * Premium vertical timeline workflow tracker.
 * Replaces traditional dashboard cards with a connected transaction flow.
 */
export function WorkflowPipeline({ steps, title = 'Transaction Stages' }: WorkflowPipelineProps) {
  return (
    <View className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm shadow-slate-100 dark:shadow-none">
      {title ? (
        <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-wider">
          {title}
        </Text>
      ) : null}

      <View className="flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <View key={step.id} className="relative pb-6 flex-row items-center">
              {/* Vertical connector line */}
              {!isLast ? (
                <View
                  className="absolute w-[2px] bg-slate-100 dark:bg-slate-800"
                  style={{
                    left: 20, // Align perfectly to the center of the 40px icon container
                    top: 40,
                    bottom: -12,
                  }}
                />
              ) : null}

              {/* Action Wrap */}
              <AnimatedPressable
                onPress={step.onPress}
                className="flex-1 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1 pr-4">
                  {/* Step Icon Circle */}
                  <View
                    style={{ backgroundColor: step.iconBg }}
                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  >
                    <Ionicons name={step.icon} size={20} color={step.iconColor} />
                  </View>

                  {/* Title & Subtitle */}
                  <View className="flex-col flex-1">
                    <Text className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {step.title}
                    </Text>
                    {step.subtitle ? (
                      <Text className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {step.subtitle}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Count Badge & Forward Icon */}
                <View className="flex-row items-center gap-2">
                  <View className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl">
                    <Text className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {step.value}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </View>
              </AnimatedPressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
