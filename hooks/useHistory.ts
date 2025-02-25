import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  timestamp: number;
  prediction: any;
  imageUri: string;
}

const HISTORY_STORAGE_KEY = '@nutribox_history';

const loadHistory = async (): Promise<HistoryItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!jsonValue) {
      // Initialize with empty array if no data exists
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Error loading history:', error);
    // Return empty array as fallback
    return [];
  }
};

const saveHistory = async (history: HistoryItem[]): Promise<boolean> => {
  if (!history || !Array.isArray(history)) {
    console.error('Invalid history data');
    return false;
  }

  try {
    // Ensure the history array is valid before saving
    const validHistory = history.filter(item => {
      return item && typeof item === 'object' && 
             'timestamp' in item && 
             'prediction' in item && 
             'imageUri' in item;
    });
    const jsonValue = JSON.stringify(validHistory);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving history:', error);
    return false;
  }
};

export const useHistory = () => {
  const queryClient = useQueryClient();

  const { data: history = [], isLoading, error } = useQuery({
    queryKey: ['history'],
    queryFn: loadHistory,
    initialData: [],
    retry: 1,
    staleTime: 1000 * 60 * 5 // Consider data fresh for 5 minutes
  });

  const addToHistory = useMutation({
    mutationFn: async (newItem: HistoryItem) => {
      const currentHistory = await loadHistory();
      const updatedHistory = [newItem, ...currentHistory];
      const success = await saveHistory(updatedHistory);
      if (!success) {
        throw new Error('Failed to save history');
      }
      return updatedHistory;
    },
    onSuccess: (updatedHistory) => {
      queryClient.setQueryData(['history'], updatedHistory);
    },
    onError: (error) => {
      console.error('Error adding to history:', error);
      alert('Failed to save to history. Please try again.');
    }
  });

  return {
    history,
    isLoading,
    error,
    addToHistory: (prediction: any, imageUri: string) => {
      const newItem: HistoryItem = {
        timestamp: Date.now(),
        prediction,
        imageUri
      };
      addToHistory.mutate(newItem);
    }
  };
};