import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  date: Date;
  result: string;
  image: string;
}

const HISTORY_KEY = 'nutribox_history';

const loadHistory = async (): Promise<HistoryItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    if (!jsonValue) return [];
    
    const items = JSON.parse(jsonValue);
    return items.map((item: any) => ({
      ...item,
      date: new Date(item.date)
    }));
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

const saveHistory = async (history: HistoryItem[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving history:', error);
    return false;
  }
};

export const useHistory = () => {
  const queryClient = useQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: [HISTORY_KEY],
    queryFn: loadHistory,
    initialData: [],
    retry: 1
  });

  const addToHistory = useMutation({
    mutationFn: async (newItem: HistoryItem) => {
      const updatedHistory = [newItem, ...history];
      const success = await saveHistory(updatedHistory);
      if (!success) {
        throw new Error('Failed to save history');
      }
      return updatedHistory;
    },
    onSuccess: (updatedHistory) => {
      queryClient.setQueryData([HISTORY_KEY], updatedHistory);
    },
    onError: (error) => {
      console.error('Error adding to history:', error);
      alert('Failed to save to history. Please try again.');
    }
  });

  return {
    history,
    addToHistory: (item: HistoryItem) => addToHistory.mutate(item)
  };
};