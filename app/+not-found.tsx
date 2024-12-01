import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = 40; // Размер кружка
const CIRCLES_HORIZONTAL = Math.ceil(width / CIRCLE_SIZE);
const CIRCLES_VERTICAL = Math.ceil(height / CIRCLE_SIZE);

export default function NotFoundScreen() {
  // Задаём 101 кружок
  const circles = Array.from({ length: 101 });
  const router = useRouter();

  // Для кнопки
  const [buttonColor, setButtonColor] = useState(getRandomColor());
  const [buttonShape, setButtonShape] = useState('circle'); // 'circle' или 'rectangle'
  const glowingBorder = useSharedValue(0);

  // Остальной код остаётся без изменений
  useEffect(() => {
    glowingBorder.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    const interval = setInterval(() => {
      setButtonColor(getRandomColor());
      setButtonShape(Math.random() > 0.5 ? 'circle' : 'rectangle');
    }, 3000);

    return () => clearInterval(interval);
  }, [glowingBorder]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    borderWidth: 2,
    borderColor: glowingBorder.value === 1 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
    shadowColor: 'rgba(255, 255, 255, 0.8)', // Светящийся эффект
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowingBorder.value,
    shadowRadius: 10,
  }));

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" />

      <Stack.Screen options={{ title: 'fodi' }} />
      <View style={styles.container}>
        {/* 101 кружок */}
        {circles.map((_, index) => (
          <Circle key={index} index={index} />
        ))}

        {/* Текст и кнопка */}
        <View style={styles.overlay}>
          <Text style={styles.title}>Sushi Master Dima Fomin</Text>
          <Animated.View
            style={[
              styles.button,
              buttonAnimatedStyle,
              {
                backgroundColor: buttonColor,
                borderRadius: buttonShape === 'circle' ? 50 : 5,
              },
            ]}
          >
            <TouchableOpacity onPress={() => router.push('/welcome')}>
              <Text style={styles.buttonText}>Table reservation!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </>
  );
}


function Circle({ index }: { index: number }) {
  const translateX = useSharedValue((index % CIRCLES_HORIZONTAL) * CIRCLE_SIZE);
  const translateY = useSharedValue(Math.floor(index / CIRCLES_HORIZONTAL) * CIRCLE_SIZE);
  const opacity = useSharedValue(Math.random() * 0.5 + 0.5); // Прозрачность от 0.5 до 1

  // Генерация случайного цвета
  const randomColor = getRandomColor();

  useEffect(() => {
    const updateTrajectory = () => {
      translateX.value = withTiming(Math.random() * width, {
        duration: 5000, // Увеличена длительность анимации
        easing: Easing.inOut(Easing.ease), // Плавное начало и окончание движения
      });
      translateY.value = withTiming(Math.random() * height, {
        duration: 5000, // Увеличена длительность анимации
        easing: Easing.inOut(Easing.ease), // Плавное начало и окончание движения
      });
      opacity.value = withTiming(Math.random() * 0.5 + 0.5, { duration: 5000 }); // Прозрачность меняется плавно
    };

    // Меняем траекторию и прозрачность каждые 5 секунд
    const interval = setInterval(updateTrajectory, 5000);

    // Устанавливаем начальную траекторию
    updateTrajectory();

    return () => clearInterval(interval);
  }, [translateX, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    backgroundColor: randomColor,
  }));

  return <Animated.View style={[styles.circle, styles.shadow, animatedStyle]} />;
}

// Функция генерации случайного цвета
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
    backgroundColor: '#000', // Чёрный фон для эффекта
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

















