import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window'); // Получение ширины и высоты экрана
const CIRCLE_COUNT = 50; // Количество кружков
const CIRCLE_SIZE = 40; // Размер кружков

export default function WelcomeScreen() {
  const router = useRouter();

  // Создаём массив кружков
  const circles = Array.from({ length: CIRCLE_COUNT });

  return (
    <View style={styles.container}>
      {/* Отображение кружков */}
      {circles.map((_, index) => (
        <MovingCircle key={index} />
      ))}

      {/* Контент страницы */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the restaurant!</Text>
        <Text style={styles.subtitle}>Signature food from a sushi master.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')} // Переход на страницу входа
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/register')} // Переход на страницу регистрации
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Компонент анимированного кружка
function MovingCircle() {
  const translateX = useSharedValue(Math.random() * width);
  const translateY = useSharedValue(Math.random() * height);

  useEffect(() => {
    // Анимация плавного движения
    translateX.value = withRepeat(
      withTiming(Math.random() * width, {
        duration: 10000, // Медленная скорость: 10 секунд
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      true // Обратное движение
    );

    translateY.value = withRepeat(
      withTiming(Math.random() * height, {
        duration: 10000, // Медленная скорость: 10 секунд
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      true // Обратное движение
    );
  }, [translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const randomColor = getRandomColor(); // Случайный цвет кружка

  return (
    <Animated.View
      style={[
        styles.circle,
        animatedStyle,
        { backgroundColor: randomColor, opacity: 0.5 }, // Прозрачность 50%
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
    borderRadius: CIRCLE_SIZE / 2, // Круглая форма
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Контент на переднем плане
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32, // Увеличен шрифт заголовка для акцента
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFD700', // Жёлтый текст для контраста
  },
  subtitle: {
    fontSize: 18, // Немного увеличен шрифт подзаголовка
    color: '#FFD700', // Жёлтый текст для подзаголовка
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 2, // Толщина рамки
    borderColor: '#FFD700', // Жёлтая рамка
    borderRadius: 30, // Овальная форма
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Прозрачный жёлтый фон
    marginVertical: 10,
    alignItems: 'center',
    width: '80%', // Кнопка занимает 80% ширины экрана
  },
  secondaryButton: {
    borderColor: '#28a745', // Зелёная рамка для кнопки регистрации
    backgroundColor: 'rgba(40, 167, 69, 0.1)', // Прозрачный зелёный фон
  },
  buttonText: {
    color: '#FFD700', // Жёлтый текст
    fontSize: 18,
    fontWeight: '600',
  },
});







