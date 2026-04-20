import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TextInputProps,
} from "react-native";
import React from "react";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
  Path,
} from "react-hook-form";
import { useTheme } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';

interface FormInputProps<T extends Record<string, any>>
  extends Omit<TextInputProps, "secureTextEntry"> {
  label: string;
  secureEntryText?: boolean;
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  placeholder?: string;
  rules?: RegisterOptions;
}

function FormInput<T extends FieldValues>({
  label,
  secureEntryText,
  name,
  control,
  errors,
  style,
  ...rest
}: FormInputProps<T>) {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.colors.text,
    },
    input: {
      height: 40,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.cardBackground,
      color: theme.colors.text,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      marginTop: 4,
      fontSize: 12,
    },
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[
              styles.input,
              errors[name] && styles.inputError,
              style,
            ]}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={theme.colors.textSecondary}
            {...rest}
          />
          {errors[name] && (
            <Text style={styles.errorText}>{errors[name]?.message as string}</Text>
          )}
        </View>
      )}
    />
  );
}

export default FormInput;
