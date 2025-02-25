import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Result') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ce73f8',
          tabBarInactiveTintColor: 'gray',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f0d0ff',
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 8
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#333',
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Result" component={ResultScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}