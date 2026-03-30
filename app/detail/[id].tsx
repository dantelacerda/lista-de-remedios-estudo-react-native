import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useMedicineDetail, useUpdateMedicine, useDeleteMedicine } from '@/hooks/useMedicines';

export default function DetailScreen() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const { data: medicine, isLoading, isError } = useMedicineDetail(id);
  const updateMutation = useUpdateMedicine(id);
  const deleteMutation = useDeleteMedicine();

  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Preenche o formulário quando os dados do remédio chegam da API
  useEffect(() => {
    if (medicine) {
      setName(medicine.name);
      setExpiryDate(medicine.expiry_date?.split('T')[0] ?? '');
    }
  }, [medicine]);

  function handleUpdate() {
    if (!name.trim()) {
      Alert.alert('Validação', 'Nome é obrigatório');
      return;
    }

    updateMutation.mutate(
      { name: name.trim(), expiry_date: expiryDate || undefined },
      {
        onSuccess: () => router.replace('/'),
        onError: () => Alert.alert('Erro', 'Não foi possível atualizar o remédio'),
      }
    );
  }

  function confirmDelete() {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        router.replace('/');
      },
      onError: () => {
        setShowDeleteDialog(false);
        Alert.alert('Erro', 'Não foi possível deletar o remédio');
      },
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
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

  const isBusy = updateMutation.isPending || deleteMutation.isPending;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Editar Remédio</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do Remédio</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={!isBusy}
          />

          <Text style={styles.label}>Data de Vencimento</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={expiryDate}
            onChangeText={setExpiryDate}
            editable={!isBusy}
          />

          <TouchableOpacity
            style={[styles.buttonPrimary, isBusy && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={isBusy}
          >
            <Text style={styles.buttonText}>
              {updateMutation.isPending ? 'Salvando...' : 'Atualizar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonDanger, isBusy && styles.buttonDisabled]}
            onPress={() => setShowDeleteDialog(true)}
            disabled={isBusy}
          >
            <Text style={styles.buttonText}>Deletar Remédio</Text>
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

      <Modal
        transparent
        animationType="fade"
        visible={showDeleteDialog}
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Deletar Remédio</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja deletar este remédio? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowDeleteDialog(false)}
                disabled={deleteMutation.isPending}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtonDelete, deleteMutation.isPending && styles.buttonDisabled]}
                onPress={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                <Text style={styles.buttonText}>
                  {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    color: '#1f2937',
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
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  buttonPrimary: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  modalMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalButtonCancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonDelete: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
