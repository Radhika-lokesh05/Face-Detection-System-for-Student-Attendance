"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// XLSX is dynamically imported in the browser-only export function to avoid
// bundling issues on the server (e.g. "fs" not found). Do not import at module top-level.

interface AttendanceRecord {
  _id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: "present" | "absent";
  confidence: number;
}

export default function ViewAttendance() {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStudentId, setFilterStudentId] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0,
  });
  const [searched, setSearched] = useState(false);

  const fetchAttendanceData = async () => {
    if (!selectedDate && !filterDepartment) {
      alert("Please select at least one filter.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.set("date", selectedDate);
      if (filterDepartment) params.set("department", filterDepartment);
      if (filterYear) params.set("year", filterYear);
      if (filterDivision) params.set("division", filterDivision);
      if (filterSubject) params.set("subject", filterSubject);
      if (filterStudentId) params.set("student_id", filterStudentId);

      const res = await fetch(`http://127.0.0.1:5000/api/attendance?${params.toString()}`);
      const raw = await res.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error("Failed to parse /api/attendance response as JSON. status=", res.status, "body=", raw);
        throw err;
      }

      if (data && data.success) {
        const mappedData: AttendanceRecord[] = data.attendance.map((record: any, idx: number) => ({
          _id: record.studentId || `row-${idx}`,
          studentId: record.studentId || record.student_id || "-",
          studentName: record.studentName || record.student_name || "-",
          date: record.date || data.date || selectedDate,
          time: record.markedAt || record.time || "-",
          status: record.status || "present",
          confidence: record.confidence || 0,
        }));
        setAttendanceData(mappedData);
        setStats(data.stats);
      }
      setSearched(true);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.set("date", selectedDate);
      if (filterDepartment) params.set("department", filterDepartment);
      if (filterYear) params.set("year", filterYear);
      if (filterDivision) params.set("division", filterDivision);
      if (filterSubject) params.set("subject", filterSubject);

      const res = await fetch(`http://127.0.0.1:5000/api/attendance/export?${params.toString()}`);
      const raw = await res.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error("Failed to parse /api/attendance/export response as JSON. status=", res.status, "body=", raw);
        throw err;
      }
      if (data && data.success) {
        // Dynamic import so bundlers (Next.js SSR) don't try to include node-only deps
        const XLSX = await import("xlsx");
        const worksheet = XLSX.utils.json_to_sheet(data.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, `attendance_${selectedDate || "export"}.xlsx`);
      }
    } catch (error) {
      console.error("Error exporting excel:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Records</h1>
            <p className="text-gray-600">View and manage student attendance data</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                <select
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Divisions</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  placeholder="Subject name"
                  className="border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  value={filterStudentId}
                  onChange={(e) => setFilterStudentId(e.target.value)}
                  placeholder="Student Id"
                  className="border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="IT">IT</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={fetchAttendanceData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔍 Search
              </button>
              <button
                onClick={exportExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                📑 Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {attendanceData.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600">{stats.presentToday}</div>
              <div className="text-sm text-gray-600">Present Today</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-red-600">{stats.absentToday}</div>
              <div className="text-sm text-gray-600">Absent Today</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.attendanceRate}%</div>
              <div className="text-sm text-gray-600">Attendance Rate</div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Attendance {selectedDate ? `for ${new Date(selectedDate).toLocaleDateString()}` : ""}
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading attendance data...</p>
            </div>
          ) : !searched ? (
            <div className="p-8 text-center text-gray-500">
              Please apply filters and click <b>Search</b> to view attendance records.
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No attendance records found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.confidence}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
