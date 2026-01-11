import { useState, useEffect } from "react";
import { Users, BookOpen, Layers, TrendingUp, GraduationCap, IndianRupee, Calendar, Clock, FileText, CreditCard, UserCheck, UserX, ArrowUpRight, ArrowDownRight, Wallet, Receipt, PiggyBank, Library, ClipboardList, Shield, UserCog, Loader2 } from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./component";
import { getDashboardStats, getStudents, getInvoiceStats, getPaymentStats } from "../../../services/apiService";

export default function DashboardPage() {
    const [session] = useState("2024-2025");
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [recentStudents, setRecentStudents] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, studentsRes, invoiceStatsRes, paymentStatsRes] = await Promise.all([
                getDashboardStats().catch(() => ({ data: null })),
                getStudents().catch(() => ({ data: [] })),
                getInvoiceStats().catch(() => ({ data: null })),
                getPaymentStats().catch(() => ({ data: null }))
            ]);
            
            setDashboardData({
                stats: statsRes.data,
                invoiceStats: invoiceStatsRes.data,
                paymentStats: paymentStatsRes.data
            });
            
            const students = studentsRes.data || [];
            setRecentStudents(students.slice(0, 4).map(s => ({
                id: s.id || s._id,
                name: s.name || s.student_name || 'Unknown',
                class: s.class_name || s.className || 'N/A',
                section: s.section || 'N/A',
                status: s.status || 'Active',
                avatar: (s.name || s.student_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            })));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const mainStats = [
        { icon: Layers, label: "Total Classes", value: dashboardData?.stats?.totalClasses || "0", bgColor: "bg-blue-100", iconColor: "text-blue-600" },
        { icon: BookOpen, label: "Total Sections", value: dashboardData?.stats?.totalSections || "0", bgColor: "bg-indigo-100", iconColor: "text-indigo-600" },
        { icon: Users, label: "Total Students", value: dashboardData?.stats?.totalStudents || "0", bgColor: "bg-purple-100", iconColor: "text-purple-600", session: true },
        { icon: UserCheck, label: "Students Active", value: dashboardData?.stats?.activeStudents || "0", bgColor: "bg-green-100", iconColor: "text-green-600", session: true },
        { icon: UserX, label: "Inactive Students", value: dashboardData?.stats?.inactiveStudents || "0", bgColor: "bg-red-100", iconColor: "text-red-600", session: true },
        { icon: ArrowUpRight, label: "Promoted Students", value: dashboardData?.stats?.promotedStudents || "0", bgColor: "bg-emerald-100", iconColor: "text-emerald-600", session: true },
        { icon: ClipboardList, label: "Total Inquiries", value: dashboardData?.stats?.totalInquiries || "0", bgColor: "bg-amber-100", iconColor: "text-amber-600" },
        { icon: FileText, label: "Inquiries Active", value: dashboardData?.stats?.activeInquiries || "0", bgColor: "bg-orange-100", iconColor: "text-orange-600" },
        { icon: ArrowDownRight, label: "Transferred Out", value: dashboardData?.stats?.transferredOut || "0", bgColor: "bg-rose-100", iconColor: "text-rose-600", session: true },
        { icon: ArrowUpRight, label: "Transferred In", value: dashboardData?.stats?.transferredIn || "0", bgColor: "bg-teal-100", iconColor: "text-teal-600", session: true },
    ];

    const invoiceStats = [
        { icon: Receipt, label: "Total Invoices", value: dashboardData?.invoiceStats?.total || "0", bgColor: "bg-blue-100", iconColor: "text-blue-600", session: true },
        { icon: CreditCard, label: "Paid Invoices", value: dashboardData?.invoiceStats?.paid || "0", bgColor: "bg-green-100", iconColor: "text-green-600", session: true },
        { icon: FileText, label: "Unpaid Invoices", value: dashboardData?.invoiceStats?.unpaid || "0", bgColor: "bg-red-100", iconColor: "text-red-600", session: true },
        { icon: Wallet, label: "Partially Paid", value: dashboardData?.invoiceStats?.partial || "0", bgColor: "bg-amber-100", iconColor: "text-amber-600", session: true },
    ];

    const paymentStats = [
        { icon: IndianRupee, label: "Total Payments", value: `₹${dashboardData?.paymentStats?.total || 0}`, bgColor: "bg-indigo-100", iconColor: "text-indigo-600", session: true },
        { icon: CreditCard, label: "Payment Received", value: `₹${dashboardData?.paymentStats?.received || 0}`, bgColor: "bg-green-100", iconColor: "text-green-600", session: true },
        { icon: Clock, label: "Amount Pending", value: `₹${dashboardData?.paymentStats?.pending || 0}`, bgColor: "bg-orange-100", iconColor: "text-orange-600", session: true },
        { icon: ArrowDownRight, label: "Expense", value: `₹${dashboardData?.paymentStats?.expense || 0}`, bgColor: "bg-red-100", iconColor: "text-red-600", session: true },
        { icon: PiggyBank, label: "Income", value: `₹${dashboardData?.paymentStats?.income || 0}`, bgColor: "bg-emerald-100", iconColor: "text-emerald-600", session: true },
    ];

    const adminStats = [
        { icon: Shield, label: "Total Admins", value: dashboardData?.stats?.totalAdmins || "0", bgColor: "bg-purple-100", iconColor: "text-purple-600" },
        { icon: UserCog, label: "Total Roles", value: dashboardData?.stats?.totalRoles || "0", bgColor: "bg-indigo-100", iconColor: "text-indigo-600" },
        { icon: Users, label: "Total Staff", value: dashboardData?.stats?.totalStaff || "0", bgColor: "bg-blue-100", iconColor: "text-blue-600" },
        { icon: UserCheck, label: "Staff Active", value: dashboardData?.stats?.activeStaff || "0", bgColor: "bg-green-100", iconColor: "text-green-600" },
    ];

    const libraryStats = [
        { icon: Library, label: "Total Books", value: dashboardData?.stats?.totalBooks || "0", bgColor: "bg-amber-100", iconColor: "text-amber-600" },
        { icon: CreditCard, label: "Library Cards", value: dashboardData?.stats?.libraryCards || "0", bgColor: "bg-blue-100", iconColor: "text-blue-600", session: true },
        { icon: BookOpen, label: "Books Issued", value: dashboardData?.stats?.booksIssued || "0", bgColor: "bg-purple-100", iconColor: "text-purple-600", session: true },
        { icon: Clock, label: "Return Pending", value: dashboardData?.stats?.returnPending || "0", bgColor: "bg-red-100", iconColor: "text-red-600", session: true },
    ];

    const examStats = [
        { icon: ClipboardList, label: "Published Timetables", value: dashboardData?.stats?.publishedTimetables || "0", bgColor: "bg-blue-100", iconColor: "text-blue-600" },
        { icon: FileText, label: "Published Admit Cards", value: dashboardData?.stats?.publishedAdmitCards || "0", bgColor: "bg-indigo-100", iconColor: "text-indigo-600" },
        { icon: TrendingUp, label: "Published Results", value: dashboardData?.stats?.publishedResults || "0", bgColor: "bg-green-100", iconColor: "text-green-600" },
    ];

    const quickActions = [
        { label: "Add Student", icon: Users, href: "/stutent/add", color: "bg-blue-500" },
        { label: "Mark Attendance", icon: Calendar, href: "/academic/attendance", color: "bg-green-500" },
        { label: "Create Invoice", icon: IndianRupee, href: "/accounting/invoices", color: "bg-purple-500" },
        { label: "Add Teacher", icon: GraduationCap, href: "/teachers", color: "bg-orange-500" },
        { label: "Add Homework", icon: BookOpen, href: "/academic/homework", color: "bg-pink-500" },
        { label: "View Results", icon: TrendingUp, href: "/examination/results", color: "bg-teal-500" },
    ];

    const upcomingEvents = [
        { id: 1, title: "Parent-Teacher Meeting", date: "Dec 20, 2024", time: "10:00 AM" },
        { id: 2, title: "Annual Sports Day", date: "Dec 25, 2024", time: "9:00 AM" },
        { id: 3, title: "Winter Break Starts", date: "Dec 28, 2024", time: "All Day" },
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ stat }) => {
        const Icon = stat.icon;
        return (
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        {stat.session && <p className="text-[10px] text-gray-400">Session: {session}</p>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Session: {session} | Welcome back!</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Main Stats - Students & Classes */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Students & Classes Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {mainStats.map((stat, index) => <StatCard key={index} stat={stat} />)}
                </div>
            </div>

            {/* Invoice Stats */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {invoiceStats.map((stat, index) => <StatCard key={index} stat={stat} />)}
                </div>
            </div>

            {/* Payment Stats */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment & Finance</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {paymentStats.map((stat, index) => <StatCard key={index} stat={stat} />)}
                </div>
            </div>

            {/* Admin & Library Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Administration</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {adminStats.map((stat, index) => <StatCard key={index} stat={stat} />)}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Library</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {libraryStats.map((stat, index) => <StatCard key={index} stat={stat} />)}
                    </div>
                </div>
            </div>

            {/* Exam Stats */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Examination</h2>
                <div className="grid grid-cols-3 gap-3">
                    {examStats.map((stat, index) => <StatCard key={index} stat={stat} />)}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <a key={index} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group">
                                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Recent Students & Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Section</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.class}</TableCell>
                                            <TableCell>{student.section}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                    <div className="space-y-3">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
                                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex flex-col items-center justify-center">
                                    <span className="text-xs font-medium text-indigo-600">{event.date.split(' ')[0]}</span>
                                    <span className="text-sm font-bold text-indigo-700">{event.date.split(' ')[1]}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{event.title}</p>
                                    <p className="text-sm text-gray-500">{event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
