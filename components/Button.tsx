import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<typeof TouchableOpacity, ButtonProps>(
  (
    {
      onPress,
      title,
      variant = 'primary',
      disabled = false,
      loading = false,
    },
    ref
  ) => {
    const styles = getStyles(variant);

    return (
      <TouchableOpacity
        ref={ref as any}
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button as ViewStyle,
          (disabled || loading) && (styles.buttonDisabled as ViewStyle),
        ]}
      >
        <Text style={styles.text as TextStyle}>
          {loading ? 'Carregando...' : title}
        </Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const baseButton: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
};

const baseText: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
};

const primaryStyles = StyleSheet.create({
  button: {
    ...baseButton,
    backgroundColor: '#3b82f6',
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  } as ViewStyle,
  text: {
    ...baseText,
    color: '#ffffff',
  } as TextStyle,
});

const dangerStyles = StyleSheet.create({
  button: {
    ...baseButton,
    backgroundColor: '#ef4444',
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: '#fca5a5',
  } as ViewStyle,
  text: {
    ...baseText,
    color: '#ffffff',
  } as TextStyle,
});

const secondaryStyles = StyleSheet.create({
  button: {
    ...baseButton,
    backgroundColor: '#e5e7eb',
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: '#f3f4f6',
  } as ViewStyle,
  text: {
    ...baseText,
    color: '#374151',
  } as TextStyle,
});

const defaultStyles = StyleSheet.create({
  button: baseButton,
  buttonDisabled: { opacity: 0.5 } as ViewStyle,
  text: baseText,
});

function getStyles(variant: 'primary' | 'danger' | 'secondary') {
  switch (variant) {
    case 'primary':
      return primaryStyles;
    case 'danger':
      return dangerStyles;
    case 'secondary':
      return secondaryStyles;
    default:
      return defaultStyles;
  }
}

export default Button;
