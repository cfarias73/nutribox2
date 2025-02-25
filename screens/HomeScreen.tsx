import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { useHistory } from '../hooks/useHistory';
import { useSubscription } from '../hooks/useSubscription';

// RapidAPI endpoint and headers
const API_URL = 'https://dietagram.p.rapidapi.com/apiFoodImageRecognition.php';
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-RapidAPI-Key': 'f674061c15mshc6125451a429cc1p169824jsnd515469e710f',
  'X-RapidAPI-Host': 'dietagram.p.rapidapi.com'
};

export default function HomeScreen({ navigation }) {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { addToHistory } = useHistory();
  const { canAnalyzeMore, incrementDailyQuota, remainingAnalyses, purchaseSubscription } = useSubscription();

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
      }
    } catch (error) {
      console.error('Error in takePhoto:', error);
      alert('Error taking photo. Please try again.');
    }
  };

  const analyzeImage = async (uri: string) => {
    if (!canAnalyzeMore()) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of free analyses. Would you like to upgrade to Premium for $10/month and get 5 analyses per day?',
        [
          {
            text: 'Maybe Later',
            style: 'cancel'
          },
          {
            text: 'Upgrade to Premium',
            onPress: async () => {
              try {
                const success = await purchaseSubscription();
                if (success) {
                  Alert.alert(
                    'Premium Activated',
                    'Thank you for upgrading! You now have 5 analyses per day.',
                    [{ text: 'OK', onPress: () => {
                      // Clear the current image and reset the state
                      setImage(null);
                      // Return to home screen state
                      navigation.navigate('Home');
                    }}]
                  );
                } else {
                  Alert.alert(
                    'Upgrade Failed',
                    'Please try again later.',
                    [{ text: 'OK' }]
                  );
                }
              } catch (error) {
                console.error('Error during premium upgrade:', error);
                Alert.alert(
                  'Error',
                  'An error occurred during the upgrade process. Please try again.',
                  [{ text: 'OK' }]
                );
              }
            }
          }
        ]
      );
      return;
    }

    try {
      setAnalyzing(true);

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
      // Increment quota after successful analysis
      await incrementDailyQuota();
      // Save to history
      addToHistory(prediction, uri);
      // Navigate to Result screen with the prediction data and image URI
      navigation.navigate('Result', { prediction, imageUri: uri });
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
            <Text style={styles.placeholderText}>Upload a clear image with all foods visible for better analysis</Text>
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

        <TouchableOpacity 
          style={[styles.button, styles.analyzeButton]} 
          onPress={() => image && analyzeImage(image)}
        >
          <Text style={styles.buttonText}>Analyze Image</Text>
          <Ionicons name="analytics-outline" size={24} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
    
        {analyzing && (
          <Text style={styles.analyzing}>Analyzing image...</Text>
        )}
        
        <Text style={styles.quotaText}>
          Remaining free analyses today: {remainingAnalyses}
        </Text>
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
    paddingTop: 0,
    width: '100%',
    minHeight: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  analyzeButton: {
    width: '100%',
    marginTop: 5,
    backgroundColor: '#ce73f8',
  },
  button: {
    backgroundColor: '#e2aefa',
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
    marginTop: 50,
    marginBottom: 20,
    padding: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  analyzing: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  quotaText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});