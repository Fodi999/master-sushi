import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000', // Чёрный фон для заголовка
        },
        headerTintColor: '#FFD700', // Жёлтый текст для заголовка и кнопок
        headerTitleStyle: {
          fontWeight: 'bold', // Жирный текст заголовка
        },
        contentStyle: {
          backgroundColor: '#000', // Чёрный фон для экранов
        },
        headerBackground: () => (
          <View style={styles.headerBackground} />
        ),
      }}
    >
      <Stack.Screen name="welcome" options={{ title: 'Welcome' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    backgroundColor: '#000', // Чёрный фон
    borderBottomWidth: 1, // Рамка снизу
    borderBottomColor: '#FFD700', // Жёлтая рамка
  },
});

















