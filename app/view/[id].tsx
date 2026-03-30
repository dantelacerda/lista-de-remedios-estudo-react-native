import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useMedicineDetail } from '@/hooks/useMedicines';

export default function ViewScreen() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const { data: medicine, isLoading, isError } = useMedicineDetail(id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  if (isError || !medicine) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Remédio não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Detalhes do Remédio</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do Remédio</Text>
          <TextInput
            style={styles.input}
            value={medicine.name}
            editable={false}
          />

          <Text style={styles.label}>Data de Vencimento</Text>
          <TextInput
            style={styles.input}
            value={medicine.expiry_date ? medicine.expiry_date.split('T')[0] : 'Não informada'}
            editable={false}
          />

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/detail/${id}`)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>ID: {medicine.id}</Text>
          {medicine.created_at && (
            <Text style={styles.infoText}>
              Criado em: {new Date(medicine.created_at).toLocaleDateString('pt-BR')}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#15803d',
    marginBottom: 20,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f0fdf4',
    color: '#374151',
  },
  editButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  infoText: {
    color: '#166534',
    fontSize: 12,
    marginBottom: 4,
  },
});
