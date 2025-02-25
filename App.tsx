import AppNavigator from './navigation/AppNavigator';
import { StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
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
  analyzeButton: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#ce73f8',
  },
  button: {
    backgroundColor: '#ce73f8',
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
    color: '#ce73f8',
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
    color: '#ce73f8',
  },
  caloriesText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ce73f8',
  },
});
