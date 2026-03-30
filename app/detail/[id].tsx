import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface Medicine {
  id: number;
  name: string;
  expiry_date?: string;
  created_at?: string;
}

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const medicineId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : id;
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (medicineId) {
      fetchMedicine();
    }
  }, [medicineId]);

  const fetchMedicine = async () => {
    try {
      console.log('Fetching medicine:', medicineId);
      const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`);
      console.log('Fetch response status:', response.status);
      const data = await response.json();
      const med = data.data || data;
      setMedicine(med);
      setName(med.name);
      setExpiryDate(med.expiry_date?.split('T')[0] || '');
    } catch (err) {
      setError('Erro ao carregar remédio');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError('');

    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      console.log('Updating medicine:', medicineId);
      const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          ...(expiryDate && { expiry_date: expiryDate }),
        }),
      });

      console.log('Update response status:', response.status);
      if (response.ok) {
        Alert.alert('Sucesso', 'Remédio atualizado', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        setError('Erro ao atualizar remédio');
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/medicines/${medicineId}`, { method: 'DELETE' });
      router.back();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  if (!medicine) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Remédio não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Editar Remédio</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>Nome do Remédio</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={!saving}
          />

          <Text style={styles.label}>Data de Vencimento</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={expiryDate}
            onChangeText={setExpiryDate}
            editable={!saving}
          />

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Salvando...' : 'Atualizar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonDelete]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonDeleteText}>Deletar Remédio</Text>
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
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
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
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDelete: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDeleteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoText: {
    color: '#1e40af',
    fontSize: 12,
    marginBottom: 4,
  },
});
