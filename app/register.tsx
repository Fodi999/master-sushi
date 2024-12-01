import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CIRCLE_COUNT = 50; // Количество кружков
const CIRCLE_SIZE = 40; // Размер кружков

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    console.log('Register with:', email, password);
    router.push('./dashboard'); // Переход в личный кабинет
  };

  // Создаём массив кружков
  const circles = Array.from({ length: CIRCLE_COUNT });

  return (
    <View style={styles.container}>
      {/* Анимированные кружки */}
      {circles.map((_, index) => (
        <MovingCircle key={index} />
      ))}

      {/* Контент страницы */}
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MovingCircle() {
  const translateX = useSharedValue(Math.random() * width);
  const translateY = useSharedValue(Math.random() * height);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(Math.random() * width, {
        duration: 10000,
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      true
    );

    translateY.value = withRepeat(
      withTiming(Math.random() * height, {
        duration: 10000,
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      true
    );
  }, [translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const randomColor = getRandomColor();

  return (
    <Animated.View
      style={[
        styles.circle,
        animatedStyle,
        { backgroundColor: randomColor, opacity: 0.5 },
      ]}
    />
  );
}

// Генерация случайного цвета
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Чёрный фон
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Контент поверх анимированных кружков
    padding: 20,
  },
  title: {
    fontSize: 32, // Увеличен шрифт заголовка
    fontWeight: 'bold',
    color: '#FFD700', // Жёлтый цвет для заголовка
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFD700', // Жёлтая рамка для полей ввода
    borderRadius: 30,
    marginBottom: 15,
    color: '#fff', // Белый текст ввода
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Полупрозрачный жёлтый фон
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 30, // Овальная форма кнопки
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Полупрозрачный жёлтый фон
    borderWidth: 2,
    borderColor: '#FFD700', // Жёлтая рамка
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFD700', // Жёлтый текст на кнопке
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#FFD700', // Жёлтый цвет для ссылки
    marginTop: 10,
    fontSize: 16,
  },
});

