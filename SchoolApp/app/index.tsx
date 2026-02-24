import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // You could return a loading screen here
  }

  if (!isAuthenticated) {
    return <Redirect href={"/login" as any} />;
  }

  return <Redirect href={"/dashboard" as any} />;
}
