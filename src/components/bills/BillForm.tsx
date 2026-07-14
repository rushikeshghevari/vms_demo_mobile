import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormDateField } from '@/components/ui/FormDateField';
import { FormTextField } from '@/components/ui/FormTextField';
import { FormSearchableDropdown } from '@/components/ui/FormSearchableDropdown';
import { TextField } from '@/components/ui/TextField';
import { billSchema, type BillFormValues } from '@/features/bills/billSchema';
import { toIsoDateString } from '@/utils/date';

const PAYMENT_TERMS_OPTIONS = [
  { value: 'Net 30', label: 'Net 30' },
  { value: 'Net 45', label: 'Net 45' },
  { value: 'Net 60', label: 'Net 60' },
  { value: 'Immediate Payment', label: 'Immediate Payment' },
  { value: '50% Advance / 50% Delivery', label: '50% Advance / 50% Delivery' },
];

interface BillFormProps {
  billCode?: string;
  quotationCode: string;
  vendorName: string;
  departmentName: string;
  defaultValues?: Partial<BillFormValues>;
  primaryLabel: string;
  secondaryLabel?: string;
  isPrimarySubmitting?: boolean;
  isSecondarySubmitting?: boolean;
  onPrimarySubmit: (values: BillFormValues) => void;
  onSecondarySubmit?: (values: BillFormValues) => void;
  onCancel: () => void;
}

export function BillForm({
  billCode,
  quotationCode,
  vendorName,
  departmentName,
  defaultValues,
  primaryLabel,
  secondaryLabel,
  isPrimarySubmitting = false,
  isSecondarySubmitting = false,
  onPrimarySubmit,
  onSecondarySubmit,
  onCancel,
}: BillFormProps) {
  const { control, handleSubmit, reset } = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    // `invoiceAmount`/`taxableAmount`/`gstAmount` are zod-coerced numbers, but TextInput only
    // ever renders a string — seed them as strings here so the default actually shows up.
    defaultValues: {
      invoiceNumber: '',
      // Pre-fills today's date for a new Bill; Edit Bill overrides this with the saved value.
      invoiceDate: toIsoDateString(new Date()),
      invoiceAmount: '' as unknown as number,
      taxableAmount: '' as unknown as number,
      gstAmount: '' as unknown as number,
      paymentTerms: '',
      dueDate: '',
      remarks: '',
      ...defaultValues,
    },
  });

  const handlePrimarySubmit = async (values: BillFormValues) => {
    try {
      await onPrimarySubmit(values);
      reset();
    } catch (error) {
      // Ignore
    }
  };

  const handleSecondarySubmit = async (values: BillFormValues) => {
    try {
      await onSecondarySubmit?.(values);
      reset();
    } catch (error) {
      // Ignore
    }
  };

  return (
    <View>
      <Text className="mb-1.5 text-sm font-semibold text-ink dark:text-slate-200">Bill Number</Text>
      <TextField
        label=""
        value={billCode ?? 'Auto-generated after saving'}
        editable={false}
        className="bg-slate-100 text-ink-muted dark:bg-slate-800"
      />

      <TextField label="Quotation Number" value={quotationCode} editable={false} className="bg-slate-100 text-ink-muted dark:bg-slate-800" />
      <TextField label="Vendor" value={vendorName} editable={false} className="bg-slate-100 text-ink-muted dark:bg-slate-800" />
      <TextField label="Department" value={departmentName} editable={false} className="bg-slate-100 text-ink-muted dark:bg-slate-800" />

      <FormTextField control={control} name="invoiceNumber" label="Invoice Number" placeholder="e.g. INV-1024" />
      <FormDateField control={control} name="invoiceDate" label="Invoice Date" maximumDate={new Date()} />
      <FormTextField control={control} name="invoiceAmount" label="Invoice Amount" placeholder="e.g. 59000" keyboardType="numeric" />
      <FormTextField control={control} name="taxableAmount" label="Taxable Amount" placeholder="e.g. 50000" keyboardType="numeric" />
      <FormTextField control={control} name="gstAmount" label="GST Amount" placeholder="e.g. 9000" keyboardType="numeric" />
      <FormSearchableDropdown
        control={control}
        name="paymentTerms"
        label="Payment Terms"
        placeholder="Select Payment Terms"
        options={PAYMENT_TERMS_OPTIONS}
      />
      <FormDateField control={control} name="dueDate" label="Due Date" />
      <FormTextField
        control={control}
        name="remarks"
        label="Remarks (optional)"
        placeholder="Any notes for this bill"
        multiline
        numberOfLines={2}
        className="h-16"
      />

      <Button label={primaryLabel} loading={isPrimarySubmitting} onPress={handleSubmit(handlePrimarySubmit)} className="mt-2" />
      {secondaryLabel && onSecondarySubmit ? (
        <Button
          label={secondaryLabel}
          variant="secondary"
          loading={isSecondarySubmitting}
          onPress={handleSubmit(handleSecondarySubmit)}
          className="mt-3"
        />
      ) : null}
      <Button label="Cancel" variant="ghost" onPress={onCancel} className="mt-3" />
    </View>
  );
}
