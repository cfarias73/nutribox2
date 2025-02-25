import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function ResultScreen({ route }) {
  const prediction = route.params?.prediction;
  const imageUri = route.params?.imageUri;

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
    <View style={styles.iPhone13mini12Container}>
      <View style={styles.imageContainer}>
        <Image 
          style={styles.foodImage} 
          source={{ uri: imageUri }}
          resizeMode="cover"
        />
      </View>
      <ScrollView style={styles.contentContainer}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  iPhone13mini12Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },
  caloriesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    marginHorizontal: 20,
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
  dishCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  commentsCard: {
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  rectangle17: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  modeLightTypeDefault: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -109.5,
  },
  rightside: {
    position: 'absolute',
    top: 16,
    right: 15,
  },
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
    padding: 15,
    marginVertical: 12,
    width: '90%',
    alignSelf: 'center',
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
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ce73f8',
  },
  dishCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    width: '90%',
    alignSelf: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  nutrientValue: {
    fontSize: 15,
    color: '#ce73f8',
    fontWeight: '600',
    textAlign: 'right',
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