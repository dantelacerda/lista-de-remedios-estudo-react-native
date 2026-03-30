import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

// Uma única instância do QueryClient para toda a aplicação.
// Ela gerencia o cache de todas as queries do TanStack Query.
const queryClient = new QueryClient();

export {
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="add" options={{ headerShown: true, title: 'Adicionar Remédio', headerStyle: { backgroundColor: '#ffffff' }, headerTintColor: '#15803d', headerTitleStyle: { fontWeight: '700' } }} />
          <Stack.Screen name="detail/[id]" options={{ headerShown: true, title: 'Editar Remédio', headerStyle: { backgroundColor: '#ffffff' }, headerTintColor: '#15803d', headerTitleStyle: { fontWeight: '700' } }} />
          <Stack.Screen name="view/[id]" options={{ headerShown: true, title: 'Detalhes do Remédio', headerStyle: { backgroundColor: '#ffffff' }, headerTintColor: '#15803d', headerTitleStyle: { fontWeight: '700' } }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
