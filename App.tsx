import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';

// RapidAPI endpoint and headers
const API_URL = 'https://dietagram.p.rapidapi.com/apiFoodImageRecognition.php';
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-RapidAPI-Key': 'f674061c15mshc6125451a429cc1p169824jsnd515469e710f',
  'X-RapidAPI-Host': 'dietagram.p.rapidapi.com'
};

// Note: You need to replace YOUR_RAPIDAPI_KEY with your actual RapidAPI key
// To get a key:
// 1. Sign up at https://rapidapi.com
// 2. Subscribe to the Dietagram API at https://rapidapi.com/logicbuilder/api/dietagram
// 3. Copy your RapidAPI key from your dashboard

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const ensureDirectoryExists = async () => {
    const directory = `${FileSystem.cacheDirectory}nutribox-images/`;
    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
    return directory;
  };

  const pickImage = async () => {
    try {
      console.log('Requesting media library permissions...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Image picker result:', result);
      if (!result.canceled) {
        console.log('Image selected:', result.assets[0].uri);
        const directory = await ensureDirectoryExists();
        const fileName = `${Date.now()}.jpg`;
        const newUri = `${directory}${fileName}`;
        
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: newUri
        });
        
        setImage(newUri);
        analyzeImage(newUri);
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      console.log('Requesting camera permissions...');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Camera result:', result);
      if (!result.canceled) {
        console.log('Photo taken:', result.assets[0].uri);
        const directory = await ensureDirectoryExists();
        const fileName = `${Date.now()}.jpg`;
        const newUri = `${directory}${fileName}`;
        
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: newUri
        });
        
        setImage(newUri);
        analyzeImage(newUri);
      }
    } catch (error) {
      console.error('Error in takePhoto:', error);
      alert('Error taking photo. Please try again.');
    }
  };

  // Inside analyzeImage function
  const analyzeImage = async (uri: string) => {
    try {
      setAnalyzing(true);
      setResult(null);
  
      // Convert image to base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });
  
      // Create form data string
      const formData = `lang=en&image_base64=${encodeURIComponent(base64Data)}`;
  
      // Send request to RapidAPI
      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: formData
      });
  
      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${await apiResponse.text()}`);
      }
  
      const prediction = await apiResponse.json();
      // Format the response based on the updated API structure
      const dishes = prediction.dishes;
      let resultText = '';
  
      dishes.forEach((dish, index) => {
        resultText += `Dish ${index + 1}: ${dish.dishName}\n\n`;
        resultText += `Calories: ${dish.calories} kcal\n`;
        resultText += `Weight: ${dish.weight}g\n`;
        resultText += `Protein: ${dish.protein}g\n`;
        resultText += `Carbs: ${dish.carbohydrates}g\n`;
        resultText += `Fat: ${dish.fat}g\n`;
        if (index < dishes.length - 1) resultText += '\n';
      });

      if (prediction.comments) {
        resultText += '\nComments:\n' + prediction.comments;
      }

      setResult(resultText);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error analyzing image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, width: '100%' }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Coloque la imagen aquí</Text>
          </View>
        )}
    
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Photo</Text>
            <Ionicons name="camera-outline" size={24} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Gallery</Text>
            <Ionicons name="images-outline" size={24} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
    
        {analyzing && (
          <Text style={styles.analyzing}>Analyzing image...</Text>
        )}
    
        {result && (
          <View style={styles.resultWrapper}>
            {result.split('\n').map((line, index) => {
              if (line.startsWith('Calories:')) {
                return (
                  <View key={index} style={styles.caloriesCard}>
                    <Text style={styles.caloriesLabel}>Calories</Text>
                    <Text style={styles.caloriesValue}>{line.split(': ')[1]}</Text>
                  </View>
                );
              }
              return null;
            })}
            <View style={styles.resultContainer}>
              {result.split('\n').map((line, index) => {
                if (!line.startsWith('Calories:') && line.includes(':') && line.trim() !== '') {
                  const [label, value] = line.split(':').map(str => str.trim());
                  return (
                    <View key={index} style={styles.nutrientRow}>
                      <Text style={styles.nutrientLabel}>{label}</Text>
                      <Text style={styles.nutrientValue}>{value}</Text>
                    </View>
                  );
                } else if (line.trim() !== '' && !line.includes(':')) {
                  return (
                    <Text key={index} style={styles.commentText}>{line}</Text>
                  );
                }
                return null;
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 80,
    width: '100%',
    minHeight: '100%',
  },
  resultWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  resultContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
  },
  commentText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonIcon: {
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  analyzing: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 2,
  },
  caloriesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    width: '80%',
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
  caloriesText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
});
