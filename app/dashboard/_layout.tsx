import { Tabs } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#000', // Чёрный фон для панели вкладок
          borderTopWidth: 1,
          borderTopColor: '#FFD700', // Жёлтая рамка сверху
        },
        tabBarActiveTintColor: '#FFD700', // Жёлтый цвет активной вкладки
        tabBarInactiveTintColor: '#fff', // Белый цвет неактивных вкладок
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#000', // Чёрный фон заголовка
          borderBottomWidth: 1,
          borderBottomColor: '#FFD700', // Жёлтая рамка в заголовке
        },
        headerTintColor: '#FFD700', // Жёлтый текст в заголовке
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Вкладка "Главная" */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          title: 'Dashboard Home',
        }}
      />
      {/* Вкладка "Заказы" */}
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: 'Orders',
          title: 'My Orders',
        }}
      />
      {/* Вкладка "Настройки" */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
          title: 'Account Settings',
        }}
      />
    </Tabs>
  );
}



