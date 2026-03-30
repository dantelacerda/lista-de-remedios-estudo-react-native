import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useCreateMedicine } from '@/hooks/useMedicines';

export default function AddScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const createMutation = useCreateMedicine();

  function handleAdd() {
    if (!name.trim()) {
      Alert.alert('Validação', 'Nome é obrigatório');
      return;
    }

    createMutation.mutate(
      { name: name.trim(), expiry_date: expiryDate || undefined },
      {
        onSuccess: () => {
          // Navigate immediately — TanStack Query's cache invalidation in
          // useCreateMedicine fires at the same time, so the list screen will
          // refetch automatically once we land back on it.
          router.replace('/');
        },
        onError: () => {
          Alert.alert('Erro', 'Não foi possível adicionar o remédio');
        },
      }
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Adicionar Remédio</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do Remédio *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dipirona 500mg"
            value={name}
            onChangeText={setName}
            editable={!createMutation.isPending}
          />

          <Text style={styles.label}>Data de Vencimento (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={expiryDate}
            onChangeText={setExpiryDate}
            editable={!createMutation.isPending}
          />

          <TouchableOpacity
            style={[styles.button, createMutation.isPending && styles.buttonDisabled]}
            onPress={handleAdd}
            disabled={createMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {createMutation.isPending ? 'Adicionando...' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#86efac',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
