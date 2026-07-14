import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';

export interface DropdownOption {
  value: string;
  label: string;
}

interface FormSearchableDropdownProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  options: DropdownOption[];
  disabled?: boolean;
  onValueChange?: (val: string) => void;
}

export function FormSearchableDropdown<TFormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select option...',
  options,
  disabled = false,
  onValueChange,
}: FormSearchableDropdownProps<TFormValues>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query));
  }, [options, searchQuery]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);
        const displayLabel = selectedOption ? selectedOption.label : '';

        return (
          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-medium text-ink dark:text-slate-200">{label}</Text>
            
            <Pressable
              accessibilityRole="button"
              disabled={disabled}
              onPress={() => {
                setSearchQuery('');
                setModalVisible(true);
              }}
              className={`flex-row items-center justify-between rounded-[10px] border px-4 py-3 bg-white dark:bg-slate-900 ${
                disabled ? 'bg-slate-100 text-ink-muted dark:bg-slate-800' : ''
              } ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
            >
              <Text
                className={`text-base flex-1 ${
                  displayLabel ? 'text-ink dark:text-white' : 'text-slate-400 dark:text-slate-500'
                }`}
                numberOfLines={1}
              >
                {displayLabel || placeholder}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={18}
                color={disabled ? '#9ca3af' : '#64748b'}
              />
            </Pressable>

            {error ? (
              <Text className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</Text>
            ) : null}

            <Modal
              visible={modalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable
                className="flex-1 justify-end bg-black/40"
                onPress={() => setModalVisible(false)}
              >
                <Pressable
                  onPress={(event) => event.stopPropagation()}
                  className="max-h-[80%] rounded-t-3xl bg-white p-6 dark:bg-slate-900"
                >
                  <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-slate-200 dark:bg-slate-700" />
                  
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-lg font-bold text-ink dark:text-white">{label}</Text>
                    <Pressable onPress={() => setModalVisible(false)} className="p-1">
                      <Ionicons name="close" size={24} color="#64748b" />
                    </Pressable>
                  </View>

                  <View className="mt-2 mb-4 flex-row items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                    <Ionicons name="search-outline" size={18} color="#94a3b8" />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder={`Search ${label.toLowerCase()}...`}
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="flex-1 text-sm text-ink dark:text-white p-0"
                    />
                  </View>

                  <FlatList
                    data={filteredOptions}
                    keyExtractor={(item) => item.value}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    renderItem={({ item }) => {
                      const isSelected = item.value === value;
                      return (
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => {
                            onChange(item.value);
                            if (onValueChange) {
                              onValueChange(item.value);
                            }
                            setModalVisible(false);
                          }}
                          className={`mb-2 flex-row items-center justify-between rounded-xl border p-4 ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 dark:border-primary-600 dark:bg-primary-950/20'
                              : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900'
                          }`}
                        >
                          <Text
                            className={`text-sm flex-1 ${
                              isSelected
                                ? 'font-semibold text-primary-600 dark:text-primary-400'
                                : 'text-ink dark:text-white'
                            }`}
                          >
                            {item.label}
                          </Text>
                          {isSelected ? (
                            <Ionicons name="checkmark" size={18} color="#2563eb" />
                          ) : null}
                        </Pressable>
                      );
                    }}
                    ListEmptyComponent={
                      <Text className="py-6 text-center text-sm text-ink-muted dark:text-slate-400">
                        No matches found.
                      </Text>
                    }
                    style={{ minHeight: 200 }}
                  />

                  <Button label="Cancel" variant="secondary" onPress={() => setModalVisible(false)} className="mt-2" />
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        );
      }}
    />
  );
}
