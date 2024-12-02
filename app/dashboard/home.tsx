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
import { Picker } from '@react-native-picker/picker';

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
  
  // Локальные состояния для каждого меню
  const [guestCounts, setGuestCounts] = useState<{ [key: string]: number }>({});
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: string | null }>({});
  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: string | null }>({});
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [openMenuIds, setOpenMenuIds] = useState<Set<string>>(new Set()); // Для отслеживания открытых меню

  const handleGuestCountChange = (value: string, menuId: string) => {
    const number = parseInt(value, 10);
    setGuestCounts((prev) => ({
      ...prev,
      [menuId]: isNaN(number) || number < 0 ? 0 : number,
    }));
  };

  const handleReservation = (menuId: string) => {
    const guestCount = guestCounts[menuId];
    const date = selectedDates[menuId];
    const time = selectedTimes[menuId];

    if (guestCount === 0) {
      Alert.alert('Error', 'Please select at least one guest to reserve a table.');
    } else if (!date) {
      Alert.alert('Error', 'Please select a date for the reservation.');
    } else if (!time) {
      Alert.alert('Error', 'Please select a time for the reservation.');
    } else {
      Alert.alert(
        'Reservation Confirmed',
        `Table reserved for ${guestCount} guest(s) on ${date} at ${time}.`
      );
    }
  };

  const handleLogout = () => {
    router.push('/welcome');
  };

  const toggleMenu = (menuId: string) => {
    setOpenMenuIds((prev) => {
      const newOpenMenuIds = new Set(prev);
      if (newOpenMenuIds.has(menuId)) {
        newOpenMenuIds.delete(menuId); // Свернуть меню
      } else {
        newOpenMenuIds.add(menuId); // Открыть меню
      }
      return newOpenMenuIds;
    });
  };

  // Функция выбора времени
  const formatTime = (hour: number, minute: number) => {
    const formattedHour = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Обработчик выбора времени
  const handleTimeSelect = (menuId: string) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [menuId]: formatTime(selectedHour, selectedMinute),
    }));
    setCalendarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const menuId = item.id;
          const isMenuOpen = openMenuIds.has(menuId);

          return (
            <View style={styles.menuItem}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => toggleMenu(menuId)} // Открыть/свернуть меню
                >
                  <Text style={styles.toggleButtonText}>{isMenuOpen ? '−' : '+'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.menuDescription}>{item.description}</Text>
              {isMenuOpen && (
                <View style={styles.optionsContainer}>
                  {item.options.map((option, index) => (
                    <View key={index}>
                      <Text style={styles.optionLabel}>
                        {option.label} - ${option.pricePerGuest * (guestCounts[menuId] || 0)} (for {guestCounts[menuId] || 0} guest(s))
                      </Text>
                      <View style={styles.detailsContainer}>
                        {option.details.map((detail, i) => (
                          <View key={i} style={styles.detailItem}>
                            <Text style={styles.detailName}>{detail.name}</Text>
                            <Text style={styles.detailDescription}>{detail.description}</Text>
                          </View>
                        ))}
                      </View>
                      {/* Выбор даты и времени для этого меню */}
                      <View style={styles.guestContainer}>
                        <Text style={styles.guestLabel}>Number of Guests:</Text>
                        <TextInput
                          style={styles.guestInput}
                          keyboardType="numeric"
                          value={String(guestCounts[menuId] || 0)}
                          onChangeText={(value) => handleGuestCountChange(value, menuId)}
                        />
                      </View>
                      <View style={styles.dateContainer}>
                        <Text style={styles.dateLabel}>Select Date and Time:</Text>
                        <TouchableOpacity
                          style={styles.dateButton}
                          onPress={() => {
                            setActiveMenuId(menuId); // Установить активный пункт меню для календаря
                            setCalendarVisible(true);
                          }}
                        >
                          <Text style={styles.dateText}>
                            {selectedDates[menuId]
                              ? `${selectedDates[menuId]} - ${selectedTimes[menuId] || 'Select Time'}`
                              : 'Select Date and Time'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {/* Модальный календарь для выбора даты и времени */}
                      <Modal
                        visible={isCalendarVisible && activeMenuId === menuId}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setCalendarVisible(false)}
                      >
                        <View style={styles.modalContainer}>
                          <View style={styles.calendarWrapper}>
                            <Calendar
                              onDayPress={(day: DateData) => {
                                setSelectedDates((prev) => ({
                                  ...prev,
                                  [menuId]: day.dateString,
                                }));
                              }}
                              markedDates={{
                                [selectedDates[menuId] || '']: { selected: true, selectedColor: '#FFD700' },
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
                            <View style={styles.timeSelectionContainer}>
                              <Text style={styles.timeSelectionLabel}>Select Time:</Text>
                              <View style={styles.timePickersContainer}>
                                <View style={styles.timePicker}>
                                  <Text style={styles.pickerLabel}>Hour</Text>
                                  <Picker
                                    selectedValue={selectedHour}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setSelectedHour(itemValue)}
                                  >
                                    {[...Array(12).keys()].map((hour) => (
                                      <Picker.Item key={hour} label={String(hour + 1)} value={hour + 1} />
                                    ))}
                                  </Picker>
                                </View>
                                <View style={styles.timePicker}>
                                  <Text style={styles.pickerLabel}>Minute</Text>
                                  <Picker
                                    selectedValue={selectedMinute}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setSelectedMinute(itemValue)}
                                  >
                                    {[0, 15, 30, 45].map((minute) => (
                                      <Picker.Item key={minute} label={`${minute}`} value={minute} />
                                    ))}
                                  </Picker>
                                </View>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.closeButton}
                              onPress={() => handleTimeSelect(menuId)}
                            >
                              <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                      <TouchableOpacity
                        style={styles.reserveButton}
                        onPress={() => handleReservation(menuId)}
                      >
                        <Text style={styles.reserveButtonText}>Reserve</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginVertical: 20,
  },
  menuItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  toggleButton: {
    padding: 8,
  },
  toggleButtonText: {
    fontSize: 20,
    color: '#FFD700',
  },
  menuDescription: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
  },
  optionsContainer: {
    marginTop: 15,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailItem: {
    marginBottom: 10,
  },
  detailName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  detailDescription: {
    fontSize: 12,
    color: '#FFF',
  },
  guestContainer: {
    marginVertical: 20,
  },
  guestLabel: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 8,
  },
  guestInput: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#333',
    color: '#FFD700',
    borderRadius: 5,
    height: 40, // Высота инпута для количества людей
    width: 200, // Ширина инпута для количества людей
    borderColor: '#FFD700', // Цвет бордера
    borderWidth: 2, // Толщина бордера
  },
  dateContainer: {
    marginVertical: 10,
  },
  dateLabel: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 8,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    width: 200, // Ширина кнопки для выбора даты и времени
    borderColor: '#FFD700', // Цвет бордера
    borderWidth: 2, // Толщина бордера
  },
  dateText: {
    fontSize: 16,
    color: '#FFD700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  calendarWrapper: {
    width: '80%',
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
  },
  timeSelectionContainer: {
    marginTop: 15,
  },
  timeSelectionLabel: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 8,
  },
  timePickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePicker: {
    width: '48%',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 8,
  },
  picker: {
    height: 150,
    backgroundColor: '#333',
    color: '#FFD700',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  reserveButton: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  reserveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});






