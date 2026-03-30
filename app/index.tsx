import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useMedicinesList, useDeleteMedicine } from '@/hooks/useMedicines';
import { useMedicineFilters } from '@/hooks/useMedicineFilters';
import { Medicine } from '@/services/medicinesApi';

export default function HomeScreen() {
  const router = useRouter();
  const { data: medicines, isLoading, isError, refetch } = useMedicinesList();
  const deleteMutation = useDeleteMedicine();

  const {
    filteredMedicines,
    nameQuery,
    setNameQuery,
    dateSort,
    cycleDateSort,
    isFilterActive,
    clearFilters,
    filteredCount,
    totalCount,
  } = useMedicineFilters(medicines);

  function handleDelete(id: number) {
    Alert.alert(
      'Deletar Remédio',
      'Tem certeza que deseja deletar este remédio? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () =>
            deleteMutation.mutate(String(id), {
              onError: () =>
                Alert.alert(
                  'Erro ao deletar',
                  'Não foi possível deletar o remédio. Tente novamente.'
                ),
            }),
        },
      ]
    );
  }

  const sortLabel =
    dateSort === 'asc'
      ? 'Vencimento \u2191'
      : dateSort === 'desc'
      ? 'Vencimento \u2193'
      : 'Ordenar por vencimento';

  const sortActive = dateSort !== 'none';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar remédios.</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Remédios</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add')}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        {/* Name search row */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome..."
              placeholderTextColor="#9ca3af"
              value={nameQuery}
              onChangeText={setNameQuery}
              autoCorrect={false}
              accessibilityLabel="Buscar remédio por nome"
              accessibilityHint="Digite o nome do remédio para filtrar a lista"
            />
            {nameQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setNameQuery('')}
                style={styles.clearInputButton}
                accessibilityLabel="Limpar busca"
              >
                <Text style={styles.clearInputButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sort button row */}
        <View style={styles.sortRow}>
          <TouchableOpacity
            onPress={cycleDateSort}
            style={[styles.sortButton, sortActive && styles.sortButtonActive]}
            accessibilityLabel={sortLabel}
            accessibilityRole="button"
          >
            <Text style={[styles.sortButtonText, sortActive && styles.sortButtonTextActive]}>
              {sortLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active filter summary */}
        {isFilterActive && (
          <View style={styles.filterSummaryRow}>
            <Text style={styles.filterCountText}>
              {filteredCount} de {totalCount} remédios
            </Text>
            <TouchableOpacity
              onPress={clearFilters}
              style={styles.clearFiltersButton}
              accessibilityLabel="Limpar todos os filtros"
              accessibilityRole="button"
            >
              <Text style={styles.clearFiltersButtonText}>Limpar filtros</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredMedicines}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhum remédio cadastrado</Text>
          </View>
        }
        renderItem={({ item }: { item: Medicine }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => router.push(`/view/${item.id}`)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.expiry_date && (
                <Text style={styles.cardSubtitle}>
                  Vencimento: {new Date(item.expiry_date).toLocaleDateString('pt-BR')}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
              disabled={deleteMutation.isPending}
            >
              <Text style={styles.deleteButtonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  // Filter bar styles
  filterBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchRow: {
    marginBottom: 8,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#1f2937',
  },
  clearInputButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  clearInputButtonText: {
    fontSize: 20,
    color: '#6b7280',
    lineHeight: 22,
  },
  sortRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  sortButton: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sortButtonActive: {
    backgroundColor: '#3b82f6',
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3b82f6',
  },
  sortButtonTextActive: {
    color: '#ffffff',
  },
  filterSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  filterCountText: {
    fontSize: 13,
    color: '#6b7280',
  },
  clearFiltersButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearFiltersButtonText: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '500',
  },
  // List styles
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  deleteButton: {
    backgroundColor: '#fecaca',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
