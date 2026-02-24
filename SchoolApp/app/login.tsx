import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest, SignupRequest } from '../services/api';

// Header Component
const Header = () => (
  <View style={styles.headerContainer}>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>School Management</Text>
      <Text style={styles.headerSubtitle}>Welcome to our app</Text>
    </View>
  </View>
);

export default function LoginScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    schoolName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, signup } = useAuth();
  const router = useRouter();

  const validate = () => {
    const e: Record<string, string> = {};
    
    if (isSignup) {
      if (!form.name.trim()) e.name = 'Name is required.';
      if (!form.email.trim()) e.email = 'Email is required.';
      if (!form.schoolName.trim()) e.schoolName = 'School name is required.';
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.';
      if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
      if (form.password !== form.confirm) e.confirm = "Passwords don't match.";
    } else {
      if (!form.email.trim()) e.email = 'Email is required.';
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.';
      if (!form.password) e.password = 'Password is required.';
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const update = (field: string) => (value: string) => {
    setForm((s) => ({ ...s, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    
    try {
      console.log('Submitting form:', { isSignup, email: form.email });
      
      if (isSignup) {
        const signupData: SignupRequest = {
          user_password: form.password,
          user_email: form.email,
          full_name: form.name,
          school_name: form.schoolName,
          created_at: new Date(),
        };
        
        console.log('Signup data:', signupData);
        const response = await signup(signupData);
        console.log('Signup response:', response);
        Alert.alert('Success', response.message);
        setIsSignup(false);
      } else {
        const loginData: LoginRequest = {
          user_password: form.password,
          user_email: form.email,
        };
        
        console.log('Login data:', loginData);
        const response = await login(loginData);
        console.log('Login response:', response);
        Alert.alert('Success', 'Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.replace('/dashboard' as any);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login/Signup error:', error);
      
      // Handle token expiration specifically
      if (error.message === 'Session expired. Please login again.') {
        Alert.alert('Session Expired', 'Your session has expired. Please login again.');
      } else {
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>
              {isSignup ? 'Create an account' : 'Sign in to your account'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignup ? 'Start your free journey.' : 'Welcome back — enter your details.'}
            </Text>
            
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsSignup((s) => !s)}
            >
              <Text style={styles.toggleButtonText}>
                {isSignup ? 'Sign in' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {errors.form && (
              <Text style={styles.errorText}>{errors.form}</Text>
            )}

            {isSignup && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={form.name}
                  onChangeText={update('name')}
                  placeholder="Your full name"
                  autoCapitalize="words"
                />
                {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={form.email}
                onChangeText={update('email')}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={form.password}
                onChangeText={update('password')}
                placeholder="Choose a strong password"
                secureTextEntry
              />
              {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
            </View>

            {isSignup && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm password</Text>
                  <TextInput
                    style={[styles.input, errors.confirm && styles.inputError]}
                    value={form.confirm}
                    onChangeText={update('confirm')}
                    placeholder="Repeat your password"
                    secureTextEntry
                  />
                  {errors.confirm && <Text style={styles.fieldError}>{errors.confirm}</Text>}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>School Name</Text>
                  <TextInput
                    style={[styles.input, errors.schoolName && styles.inputError]}
                    value={form.schoolName}
                    onChangeText={update('schoolName')}
                    placeholder="Enter your school name"
                    autoCapitalize="words"
                  />
                  {errors.schoolName && <Text style={styles.fieldError}>{errors.schoolName}</Text>}
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignup ? 'Create account' : 'Sign in'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Text
                  style={styles.footerLink}
                  onPress={() => setIsSignup((s) => !s)}
                >
                  {isSignup ? 'Sign in' : 'Create one'}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    backgroundColor: '#4f46e5',
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldError: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  footerLink: {
    color: '#4f46e5',
    fontWeight: '500',
  },
});
