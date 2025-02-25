import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBSCRIPTION_KEY = '@nutribox_subscription';
const DAILY_QUOTA_KEY = '@nutribox_daily_quota';
const FREE_DAILY_LIMIT = 1;
const PREMIUM_DAILY_LIMIT = 5;

export const useSubscription = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [dailyQuota, setDailyQuota] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeSubscription();
  }, []);

  const initializeSubscription = async () => {
    try {
      // Load stored subscription status
      const storedStatus = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      setIsPremium(storedStatus === 'true');

      // Load daily quota
      const today = new Date().toDateString();
      const storedQuota = await AsyncStorage.getItem(`${DAILY_QUOTA_KEY}_${today}`);
      setDailyQuota(storedQuota ? parseInt(storedQuota) : 0);

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing subscription:', error);
      setIsLoading(false);
    }
  };

  const updateSubscriptionStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, status.toString());
      setIsPremium(status);
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const purchaseSubscription = async (): Promise<boolean> => {
    try {
      // Simulate a successful purchase
      await updateSubscriptionStatus(true);
      return true;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      return false;
    }
  };

  const incrementDailyQuota = async () => {
    try {
      const today = new Date().toDateString();
      const newQuota = dailyQuota + 1;
      await AsyncStorage.setItem(`${DAILY_QUOTA_KEY}_${today}`, newQuota.toString());
      setDailyQuota(newQuota);
    } catch (error) {
      console.error('Error incrementing daily quota:', error);
    }
  };

  const canAnalyzeMore = () => {
    const limit = isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
    return dailyQuota < limit;
  };

  const remainingAnalyses = isPremium 
    ? PREMIUM_DAILY_LIMIT - dailyQuota 
    : FREE_DAILY_LIMIT - dailyQuota;

  return {
    isPremium,
    isLoading,
    canAnalyzeMore,
    remainingAnalyses,
    purchaseSubscription,
    incrementDailyQuota
  };
};