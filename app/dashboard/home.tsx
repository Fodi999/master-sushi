import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';

const menuItems = [
  {
    id: '1',
    title: 'Sushi Deluxe',
    description: 'A selection of premium sushi prepared by our master chef.',
    options: [
      {
        label: '3 dishes',
        pricePerGuest: 30,
        details: [
          { name: 'Salmon Sushi', description: 'Fresh salmon over sushi rice.' },
          { name: 'Tuna Roll', description: 'Rolled sushi with fresh tuna.' },
          { name: 'Shrimp Tempura', description: 'Crispy shrimp tempura.' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Ramen Special',
    description: 'Traditional Japanese ramen with your choice of toppings.',
    options: [
      {
        label: '3 dishes',
        pricePerGuest: 25,
        details: [
          { name: 'Pork Ramen', description: 'Traditional ramen with pork broth.' },
          { name: 'Chicken Ramen', description: 'Light chicken broth ramen.' },
          { name: 'Veggie Ramen', description: 'Vegetarian ramen with tofu.' },
        ],
      },
    ],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const toggleDetails = (optionId: string) => {
    setExpandedOption(expandedOption === optionId ? null : optionId);
  };

  const handleGuestCountChange = (value: string) => {
    const number = parseInt(value, 10);
    setGuestCount(isNaN(number) || number < 0 ? 0 : number);
  };

  const handleReservation = () => {
    if (guestCount === 0) {
      Alert.alert('Error', 'Please select at least one guest to reserve a table.');
    } else if (!selectedDate) {
      Alert.alert('Error', 'Please select a date for the reservation.');
    } else {
      Alert.alert(
        'Reservation Confirmed',
        `Table reserved for ${guestCount} guest(s) on ${selectedDate}.`
      );
    }
  };

  const handleLogout = () => {
    router.push('/welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => toggleDetails(item.id)}
          >
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
            {expandedOption === item.id && (
              <View style={styles.optionsContainer}>
                {item.options.map((option, index) => (
                  <View key={index}>
                    <Text style={styles.optionLabel}>
                      {option.label} - ${option.pricePerGuest * guestCount} (for {guestCount} guest(s))
                    </Text>
                    <View style={styles.detailsContainer}>
                      {option.details.map((detail, i) => (
                        <View key={i} style={styles.detailItem}>
                          <Text style={styles.detailName}>{detail.name}</Text>
                          <Text style={styles.detailDescription}>{detail.description}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}
      />
      {/* Управление количеством гостей */}
      <View style={styles.guestContainer}>
        <Text style={styles.guestLabel}>Number of Guests:</Text>
        <TextInput
          style={styles.guestInput}
          keyboardType="numeric"
          value={String(guestCount)}
          onChangeText={handleGuestCountChange}
        />
      </View>
      {/* Кнопка для открытия календаря */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setCalendarVisible(true)}
        >
          <Text style={styles.dateText}>
            {selectedDate || 'Select a Date'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Модальный календарь */}
      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarWrapper}>
            <Calendar
              onDayPress={(day: DateData) => {
                setSelectedDate(day.dateString);
                setCalendarVisible(false); // Закрытие календаря после выбора
              }}
              markedDates={{
                [selectedDate || '']: { selected: true, selectedColor: '#FFD700' },
              }}
              theme={{
                backgroundColor: '#000',
                calendarBackground: '#000',
                textSectionTitleColor: '#FFD700',
                selectedDayBackgroundColor: '#FFD700',
                selectedDayTextColor: '#000',
                dayTextColor: '#fff',
                todayTextColor: '#FFD700',
                arrowColor: '#FFD700',
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Кнопка "Заказать стол" */}
      <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
        <Text style={styles.reserveButtonText}>Reserve Table</Text>
      </TouchableOpacity>
      {/* Кнопка "Выйти" */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionLabel: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 5,
  },
  detailsContainer: {
    marginTop: 5,
    paddingLeft: 15,
  },
  detailItem: {
    marginBottom: 5,
  },
  detailName: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  detailDescription: {
    fontSize: 12,
    color: '#fff',
  },
  guestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  guestLabel: {
    fontSize: 16,
    color: '#FFD700',
  },
  guestInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
    padding: 5,
    color: '#fff',
    textAlign: 'center',
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 10,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  dateText: {
    color: '#FFD700',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  calendarWrapper: {
    margin: 20,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 15,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reserveButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    marginBottom: 20,
  },
  reserveButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
  },
});













