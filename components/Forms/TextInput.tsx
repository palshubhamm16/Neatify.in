import { Controller } from "react-hook-form";
import { StyleSheet, TextInput as RNTextInput, View, Text } from "react-native";

const TextInput = ({
  control,
  placeholder,
  required,
  label,
  name,
}: {
  control: any;
  placeholder: string;
  required?: boolean;
  label: string;
  name: string;
}) => {
  return (
    <Controller
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <Text style={styles.label}>
            {label}

            {required && <Text style={{ color: "white" }}>*</Text>}
          </Text>
          <RNTextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={[styles.textInput, { borderColor: error ? "red" : "white" }]}
            autoComplete="off"
            autoCapitalize="none"
          />
          {error && <Text style={{ color: "red" }}>{error.message}</Text>}
        </View>
      )}
      name={name}
      rules={{ required: required && "This field is required !" }}
    />
  );
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 5,
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "white",
    borderRadius: 10,
    padding: 13,
    width: "100%",
    color: "white",
    marginTop: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
});