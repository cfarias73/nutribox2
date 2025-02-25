import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useHistory } from '../hooks/useHistory';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen({ navigation }) {
  const { history } = useHistory();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateToResult = (prediction, imageUri) => {
    navigation.navigate('Result', { prediction, imageUri });
  };

  const navigateMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const filteredHistory = history.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.monthButton}>
          <Ionicons name="chevron-back" size={24} color="#ce73f8" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{months[selectedMonth]} {selectedYear}</Text>
        <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.monthButton}>
          <Ionicons name="chevron-forward" size={24} color="#ce73f8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay análisis previos</Text>
          </View>
        ) : (
          filteredHistory.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyCard}
              onPress={() => navigateToResult(item.prediction, item.imageUri)}
            >
              <Image source={{ uri: item.imageUri }} style={styles.foodImage} />
              <View style={styles.cardContent}>
                <Text style={styles.dateText}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </Text>
                <Text style={styles.dishText}>
                  {item.prediction.dishes[0]?.dishName || 'Unknown Dish'}
                </Text>
                <Text style={styles.caloriesText}>
                  {item.prediction.dishes.reduce(
                    (sum, dish) => sum + (parseInt(dish.calories) || 0),
                    0
                  )}{' '}
                  kcal
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  monthButton: {
    padding: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 8,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  dishText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  caloriesText: {
    fontSize: 15,
    color: '#ce73f8',
    fontWeight: '600',
  },
});