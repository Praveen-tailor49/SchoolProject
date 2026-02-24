import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

// Dashboard Header Component
const DashboardHeader = ({ user, onLogout }: { user: any; onLogout: () => void }) => (
  <View style={dashboardStyles.headerContainer}>
    <View style={dashboardStyles.headerContent}>
      <View>
        <Text style={dashboardStyles.headerTitle}>School Dashboard</Text>
        <Text style={dashboardStyles.headerSubtitle}>Welcome, {user?.name || 'User'}!</Text>
      </View>
      <TouchableOpacity style={dashboardStyles.logoutButton} onPress={onLogout}>
        <Text style={dashboardStyles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface StatCard {
  icon: string;
  label: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
  session?: boolean;
}

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const { user, logout } = useAuth();

  const session = "2024-2025";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For now, use mock data until we fix the API endpoints
      const mockData = {
        totalClasses: 10,
        totalSections: 20,
        totalStudents: 500,
        activeStudents: 450,
        inactiveStudents: 50,
        promotedStudents: 400,
        totalInquiries: 25,
        activeInquiries: 15,
        transferredOut: 10,
        transferredIn: 8,
        totalAdmins: 5,
        totalRoles: 3,
        totalStaff: 25,
        activeStaff: 20,
        totalBooks: 1000,
        libraryCards: 450,
        booksIssued: 200,
        returnPending: 25,
        publishedTimetables: 5,
        publishedAdmitCards: 3,
        publishedResults: 2,
      };

      const mockStudents = [
        { id: 1, name: 'John Doe', class: '10A', section: 'A', status: 'Active' },
        { id: 2, name: 'Jane Smith', class: '9B', section: 'B', status: 'Active' },
        { id: 3, name: 'Mike Johnson', class: '11C', section: 'C', status: 'Active' },
        { id: 4, name: 'Sarah Williams', class: '8A', section: 'A', status: 'Active' },
      ];

      setDashboardData(mockData);
      setRecentStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const mainStats: StatCard[] = [
    { icon: '📚', label: "Total Classes", value: dashboardData?.totalClasses || "0", bgColor: "#dbeafe", iconColor: "#2563eb" },
    { icon: '📖', label: "Total Sections", value: dashboardData?.totalSections || "0", bgColor: "#e0e7ff", iconColor: "#4f46e5" },
    { icon: '👥', label: "Total Students", value: dashboardData?.totalStudents || "0", bgColor: "#f3e8ff", iconColor: "#9333ea", session: true },
    { icon: '✅', label: "Students Active", value: dashboardData?.activeStudents || "0", bgColor: "#dcfce7", iconColor: "#16a34a", session: true },
    { icon: '❌', label: "Inactive Students", value: dashboardData?.inactiveStudents || "0", bgColor: "#fee2e2", iconColor: "#dc2626", session: true },
    { icon: '⬆️', label: "Promoted Students", value: dashboardData?.promotedStudents || "0", bgColor: "#d1fae5", iconColor: "#059669", session: true },
  ];

  const invoiceStats: StatCard[] = [
    { icon: '🧾', label: "Total Invoices", value: dashboardData?.totalInvoices || "0", bgColor: "#dbeafe", iconColor: "#2563eb", session: true },
    { icon: '💳', label: "Paid Invoices", value: dashboardData?.paidInvoices || "0", bgColor: "#dcfce7", iconColor: "#16a34a", session: true },
    { icon: '📄', label: "Unpaid Invoices", value: dashboardData?.unpaidInvoices || "0", bgColor: "#fee2e2", iconColor: "#dc2626", session: true },
    { icon: '💰', label: "Partially Paid", value: dashboardData?.partialInvoices || "0", bgColor: "#fef3c7", iconColor: "#d97706", session: true },
  ];

  const quickActions = [
    { label: "Add Student", icon: "👤", color: "#3b82f6" },
    { label: "Mark Attendance", icon: "📅", color: "#10b981" },
    { label: "Create Invoice", icon: "💰", color: "#8b5cf6" },
    { label: "Add Teacher", icon: "👨‍🏫", color: "#f97316" },
    { label: "Add Homework", icon: "📚", color: "#ec4899" },
    { label: "View Results", icon: "📊", color: "#14b8a6" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Parent-Teacher Meeting", date: "Dec 20, 2024", time: "10:00 AM" },
    { id: 2, title: "Annual Sports Day", date: "Dec 25, 2024", time: "9:00 AM" },
    { id: 3, title: "Winter Break Starts", date: "Dec 28, 2024", time: "All Day" },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const StatCard = ({ stat }: { stat: StatCard }) => (
    <View style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
      <View style={styles.statIcon}>
        <Text style={styles.statIconText}>{stat.icon}</Text>
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
        {stat.session && <Text style={styles.sessionText}>Session: {session}</Text>}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <DashboardHeader user={user} onLogout={logout} />

      {/* Main Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Students & Classes Overview</Text>
        <View style={styles.statsGrid}>
          {mainStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </View>
      </View>

      {/* Invoice Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Summary</Text>
        <View style={styles.statsGrid}>
          {invoiceStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Text style={styles.actionIconText}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Students */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Students</Text>
        <View style={styles.card}>
          {recentStudents.map((student) => (
            <View key={student.id} style={styles.studentRow}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentDetails}>
                  Class {student.class} - Section {student.section}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: student.status === 'Active' ? '#dcfce7' : '#f3f4f6' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: student.status === 'Active' ? '#166534' : '#6b7280' }
                ]}>
                  {student.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.card}>
          {upcomingEvents.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.eventDate}>
                <Text style={styles.eventDay}>{event.date.split(' ')[0]}</Text>
                <Text style={styles.eventMonth}>{event.date.split(' ')[1]}</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statIconText: {
    fontSize: 20,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  sessionText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  studentDetails: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  eventDate: {
    width: 48,
    height: 48,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDay: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4f46e5',
  },
  eventMonth: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4338ca',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  eventTime: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});

// Dashboard Header Styles
const dashboardStyles = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 2,
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
