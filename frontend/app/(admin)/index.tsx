import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type Report = {
  _id: string;
  campus: string;
  category: string;
  status: string;  // Status could be "pending", "ongoing", or "completed"
  createdAt: string;
  imageUrl: string;
  description: string;
  userId: string;
  area?: string;
  coordinates?: number[];
};

const AdminLandingPage = () => {
  const { getToken } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // For controlling the dropdown visibility
  const [selectedReport, setSelectedReport] = useState<Report | null>(null); // For tracking which report's status to update

  const fetchReports = async (category: string = "") => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken({ template: "neatify" });
      const location = await SecureStore.getItemAsync("admin_location");

      if (!token || !location) {
        throw new Error("Missing token or admin location.");
      }

      const response = await fetch(`${API_BASE_URL}/api/reports/fetch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reports.");
      }

      setReports(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openInMap = (coordinates: number[]) => {
    if (coordinates.length === 2) {
      const [lng, lat] = coordinates;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  // Determine the status color based on the status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF4D4D"; // Red
      case "ongoing":
        return "#FF9E2C"; // Orange
      case "completed":
        return "#4CAF50"; // Green
      default:
        return "#000"; // Default color (black)
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedReport) return;

    try {
      const token = await getToken({ template: "neatify" });

      if (!token) {
        throw new Error("Missing authentication token.");
      }

      // Update status on the backend
      const response = await fetch(`${API_BASE_URL}/api/reports/updateStatus`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: selectedReport._id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status.");
      }

      // Close dropdown and update the report list
      setShowDropdown(false);
      fetchReports(); // Refresh reports after status update
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  const renderReport = ({ item }: { item: Report }) => (
    <View style={styles.reportCard}>
      <Text style={styles.title}>📍 {item.campus}</Text>

      {/* Status at top-right corner */}
      <View
        style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
      >
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>

      {/* Three dot button for status update */}
      <TouchableOpacity
        style={styles.threeDotButton}
        onPress={() => {
          setSelectedReport(item);
          setShowDropdown(true); // Show the dropdown for this report
        }}
      >
        <Text style={styles.threeDotText}>⋮</Text>
      </TouchableOpacity>

      <View style={styles.fieldBox}>
        <Text>🗂 Category: {item.category}</Text>
      </View>

      <View style={styles.fieldBox}>
        <Text>📝 Description: {item.description}</Text>
      </View>

      <View style={styles.fieldBox}>
        <Text>Date: {new Date(item.createdAt).toLocaleString()}</Text>
      </View>

      {item.area && (
        <View style={styles.fieldBox}>
          <Text>🏢 Area: {item.area}</Text>
        </View>
      )}

      {item.coordinates && item.coordinates.length === 2 && (
        <TouchableOpacity onPress={() => item.coordinates && openInMap(item.coordinates)}>
          <View style={styles.fieldBox}>
            <Text style={styles.mapLink}>
              📌 Coordinates: {item.coordinates[0].toFixed(5)}, {item.coordinates[1].toFixed(5)} (Tap to open)
            </Text>
          </View>
        </TouchableOpacity>
      )}

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
      <Text style={styles.heading}>Admin Reports</Text>

      <View style={styles.tabs}>
        {["", "campus", "room", "helpdesk"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, selectedCategory === cat && styles.activeTab]}
            onPress={() => {
              setSelectedCategory(cat);
              fetchReports(cat);
            }}
          >
            <Text style={styles.tabText}>
              {cat ? cat.toUpperCase() : "ALL"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          renderItem={renderReport}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Dropdown modal for status update */}
      {showDropdown && selectedReport && (
        <Modal
          visible={showDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Status</Text>
                <Button
                  title="Ongoing"
                  onPress={() => handleStatusUpdate("ongoing")}
                />
                <Button
                  title="Completed"
                  onPress={() => handleStatusUpdate("completed")}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default AdminLandingPage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 40,
  },
  error: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginBottom: 10,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 3,
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
    borderRadius: 12,  // Rounded corners for the report card
    marginBottom: 12,
    position: "relative",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fieldBox: {
    backgroundColor: "#f0f0f0",  // Grey box for each field
    borderRadius: 10,  // Rounded corners for each field
    padding: 10,
    marginBottom: 10,
  },
  imagePreview: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  mapLink: {
    color: "#007AFF",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  // Status Badge Styles (Top-right corner)
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 17,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  // Three dots button
  threeDotButton: {
    position: "absolute",
    top: 13,
    right: 7,
  },
  threeDotText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});
