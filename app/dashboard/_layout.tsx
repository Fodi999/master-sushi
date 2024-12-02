import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Используем иконки из Expo
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#FFD700', // Жёлтый цвет активной вкладки
        tabBarInactiveTintColor: '#fff', // Белый цвет неактивных вкладок
        tabBarLabelStyle: styles.tabBarLabelStyle,
        headerStyle: styles.headerStyle,
        headerTintColor: '#FFD700',
        headerTitleStyle: styles.headerTitleStyle,
        // Добавляем кнопку "Log Out" в заголовок
        headerRight: () => (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push('/welcome')}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          title: 'Dashboard Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: 'Orders',
          title: 'My Orders',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
          title: 'Account Settings',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#000', // Чёрный фон для панели вкладок
    borderTopWidth: 1,
    borderTopColor: '#FFD700', // Жёлтая рамка сверху
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  logoutButton: {
      marginRight: 10, // Отступ от правого края
      paddingVertical: 5, // Уменьшенные вертикальные отступы
      paddingHorizontal: 10, // Уменьшенные горизонтальные отступы
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderRadius: 15, // Меньший радиус для овальной формы
      borderWidth: 1,
      borderColor: '#FFD700',
  },
  logoutText: {
      color: '#FFD700', // Жёлтый текст
      fontSize: 12, // Уменьшенный размер текста
      fontWeight: 'bold',
    },
  });
  








