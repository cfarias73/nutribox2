import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function ResultScreen({ route }) {
  const prediction = route.params?.prediction;

  if (!prediction) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No hay resultados disponibles</Text>
      </View>
    );
  }

  const { dishes } = prediction;
  const totalCalories = dishes.reduce((sum, dish) => sum + (parseInt(dish.calories) || 0), 0);

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.container}>
        <View style={styles.caloriesCard}>
          <Text style={styles.caloriesLabel}>Total Calories</Text>
          <Text style={styles.caloriesValue}>{totalCalories} kcal</Text>
        </View>

        {dishes.map((dish, dishIndex) => (
          <View key={dishIndex} style={styles.dishCard}>
            <Text style={styles.dishName}>Dish {dishIndex + 1}: {dish.dishName}</Text>
            
            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Calories</Text>
              <Text style={styles.nutrientValue}>{dish.calories} kcal</Text>
            </View>

            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Weight</Text>
              <Text style={styles.nutrientValue}>{dish.weight}g</Text>
            </View>

            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Protein</Text>
              <Text style={styles.nutrientValue}>{dish.protein}g</Text>
            </View>

            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Carbs</Text>
              <Text style={styles.nutrientValue}>{dish.carbohydrates}g</Text>
            </View>

            <View style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>Fat</Text>
              <Text style={styles.nutrientValue}>{dish.fat}g</Text>
            </View>
          </View>
        ))}

        {prediction.comments && (
          <View style={styles.commentsCard}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <Text style={styles.commentsText}>{prediction.comments}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  caloriesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
    alignItems: 'center',
  },
  caloriesLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  dishCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  nutrientLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  nutrientValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  commentsCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  commentsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});