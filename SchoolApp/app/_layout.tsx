import React, { useEffect } from 'react';
import { Stack, Redirect, useRouter } from "expo-router";
import { StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Custom Header Component
const CustomHeader = ({ title, showLogout = false, onLogout }: { 
  title: string; 
  showLogout?: boolean; 
  onLogout?: () => void; 
}) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    {showLogout && onLogout && (
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    )}
  </View>
);

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login' as any);
      } else {
        router.replace('/dashboard' as any);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null; // You could return a loading screen here
  }

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

// Styles for the header
const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
