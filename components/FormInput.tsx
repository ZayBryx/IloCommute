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

interface FormInputProps<T extends Record<string, any>>
  extends Omit<TextInputProps, "secureTextEntry"> {
  label: string;
  secureEntryText?: boolean;
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
}

const FormInput = <T extends Record<string, any>>({
  label,
  secureEntryText,
  name,
  control,
  errors,
  placeholder,
  rules,
  ...props
}: FormInputProps<T>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors[name] && styles.inputError]}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            secureTextEntry={secureEntryText}
            onChangeText={onChange}
            {...props}
          />
        )}
        rules={rules}
      />
      {errors[name] && (
        <Text style={styles.errorText}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
