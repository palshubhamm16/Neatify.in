import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

type Report = {
  _id: string;
  campus: string;
  category: string;
  status: "pending" | "ongoing" | "completed";
  createdAt: string;
  imageUrl: string;
  description: string;
  userId: string;
};

const mockReports: Report[] = [
  {
    _id: "1",
    campus: "North Campus",
    category: "room",
    status: "pending",
    createdAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/300x200.png?text=Report+1",
    description: "Spilled trash in front of dorm.",
    userId: "user_abc123",
  },
  {
    _id: "2",
    campus: "South Campus",
    category: "campus",
    status: "completed",
    createdAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/300x200.png?text=Report+2",
    description: "Overflowing bins near the cafeteria.",
    userId: "user_xyz456",
  },
  {
    _id: "3",
    campus: "Central Campus",
    category: "helpdesk",
    status: "ongoing",
    createdAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/300x200.png?text=Report+3",
    description: "Broken tap in hostel washroom.",
    userId: "user_lmn789",
  },
];

const getStatusColor = (status: Report["status"]) => {
  switch (status) {
    case "pending":
      return "#e74c3c";
    case "ongoing":
      return "#e67e22";
    case "completed":
      return "#2ecc71";
    default:
      return "#ccc";
  }
};

const Pickup = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReports = selectedStatus
    ? reports.filter((r) => r.status === selectedStatus)
    : reports;

  const renderReport = ({ item }: { item: Report }) => (
    <View style={styles.reportCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>📍 {item.campus}</Text>
        <Text
          style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text>🆔 User ID: {item.userId}</Text>
      <Text>🗂 Category: {item.category}</Text>
      <Text>📝 Description: {item.description}</Text>
      <Text>Date: {new Date(item.createdAt).toLocaleString()}</Text>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Reports</Text>

      <View style={styles.tabs}>
        {["", "pending", "ongoing", "completed"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.tab, selectedStatus === status && styles.activeTab]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text style={styles.tabText}>
              {status ? status.toUpperCase() : "ALL"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item._id}
          renderItem={renderReport}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Pickup;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Center the heading under the dynamic island
    marginTop: 40, // Adjust top margin for dynamic island
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between", // Ensure even space between tabs
    marginBottom: 15,
    width: "100%", // Ensure tabs take full width
    paddingHorizontal: 0, // No side padding for container
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginBottom: 10,
    flex: 1, // Ensure tabs expand to fill space evenly
    alignItems: "center", // Ensure tab content is centered
  },
  activeTab: {
    backgroundColor: "#333",
  },
  tabText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 11, // Adjust this value to change text size (default is 18)
  },
  list: { paddingBottom: 100 },
  reportCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusTag: {
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
  imagePreview: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
});
