import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-react"; // Clerk hooks to get user info and generate token

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

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

const Tips = () => {
  const [reports, setReports] = useState<Report[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { user } = useUser(); // Get user info from Clerk
  const { getToken } = useAuth(); // Clerk's getToken function for authentication

  useEffect(() => {
    if (user) {
      const fetchReports = async () => {
        try {
          const token = await getToken({ template: "neatify" }); // Generate token for authentication

          if (!token) {
            console.error("Authentication failed: No token generated.");
            return;
          }

          const response = await fetch(`${API_BASE_URL}/api/reports/user/reports`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request
            },
          });

          const data = await response.json();
          console.log("Fetched reports:", data);

          if (Array.isArray(data)) {
            setReports(data); // Only set data if it is an array
          } else {
            console.error("Invalid data format:", data);
          }
        } catch (error) {
          console.error("Error fetching reports:", error);
        } finally {
          setLoading(false); // Stop loading spinner when done
        }
      };
      fetchReports();
    }
  }, [user, getToken]); // Fetch when the user is available

  const filteredReports = selectedStatus
    ? (Array.isArray(reports) ? reports.filter((r) => r.status === selectedStatus) : [])
    : reports;

  const renderReport = ({ item }: { item: Report }) => (
    <View style={styles.reportCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>📍 {item.campus}</Text>
        <Text
          style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]} >
          {item.status.toUpperCase()}
        </Text>
      </View>
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
            onPress={() => setSelectedStatus(status)}>
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

export default Tips;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 40,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 0,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginBottom: 10,
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#333",
  },
  tabText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 11,
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
    fontSize: 20,
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
