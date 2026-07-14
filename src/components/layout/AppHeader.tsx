import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, DrawerActions } from '@react-navigation/native';

import { BrandLogo } from '@/components/branding/BrandLogo';
import { useTheme } from '@/providers/ThemeProvider';
import { useDrawer } from '@/navigation/context/DrawerContext';

interface AppHeaderProps {
  /** `solid` is the primary-blue bar used by Profile/ComingSoon. `brand` is the light, logo-centered bar used by the Dashboard. */
  variant?: 'solid' | 'brand';
  title?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  leftAccessibilityLabel?: string;
  rightSlot?: ReactNode;
}

/** Top bar used across the authenticated app (Dashboard, Profile, etc.). */
export function AppHeader({
  variant = 'solid',
  title,
  leftIcon,
  onLeftPress,
  leftAccessibilityLabel,
  rightSlot,
}: AppHeaderProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const drawer = useDrawer();
  const { scheme } = useTheme();

  const currentRouteName = route.name;

  const ROOT_ROUTE_NAMES = new Set([
    'Dashboard',
    'UserList',
    'DepartmentList',
    'VendorList',
    'QuotationList',
    'BillList',
    'AccountsBillList',
    'PurchaseOrderList',
    'PaymentList',
    'ProfileHome',
    'Reports',
  ]);

  const isRootRoute = ROOT_ROUTE_NAMES.has(currentRouteName);
  const canGoBack = navigation.canGoBack();
  const hasDrawer = !!drawer;

  const defaultIcon = (hasDrawer && isRootRoute)
    ? 'menu'
    : (canGoBack ? 'arrow-back' : undefined);

  const defaultPress = (hasDrawer && isRootRoute)
    ? () => drawer?.openDrawer()
    : (canGoBack ? () => navigation.goBack() : undefined);

  const resolvedIcon = leftIcon ?? defaultIcon;
  const isMenuIcon = resolvedIcon === 'menu' || resolvedIcon === 'menu-outline';
  const resolvedPress = onLeftPress ?? (
    isMenuIcon
      ? () => drawer?.openDrawer()
      : defaultPress
  );

  if (variant === 'brand') {
    return (
      <View className="flex-row items-center justify-between bg-white px-4 py-3 dark:bg-surface-dark">
        {resolvedIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={leftAccessibilityLabel ?? 'Navigation control'}
            onPress={resolvedPress}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center"
          >
            <Ionicons name={resolvedIcon} size={26} color={scheme === 'dark' ? '#ffffff' : '#212121'} />
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}

        <BrandLogo size="sm" />

        <View className="flex-row items-center gap-3" style={{ minWidth: 40 }}>
          {rightSlot}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between bg-primary-600 px-4 py-4">
      <View className="w-10">
        {resolvedIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={leftAccessibilityLabel ?? title}
            onPress={resolvedPress}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center"
          >
            <Ionicons name={resolvedIcon} size={24} color="#ffffff" />
          </Pressable>
        ) : null}
      </View>

      <Text className="flex-1 text-center text-lg font-bold text-white" numberOfLines={1}>
        {title}
      </Text>

      <View className="flex-row items-center justify-end gap-3" style={{ minWidth: 40 }}>
        {rightSlot}
      </View>
    </View>
  );
}
