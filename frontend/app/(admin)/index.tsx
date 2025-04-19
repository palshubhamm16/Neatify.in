import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type Report = {
  _id: string;
  campus: string;
  category: string;
  status: string;
  createdAt: string;
  imageUrl: string;
  description: string;
  userId: string;
};

const AdminLandingPage = () => {
  const { getToken } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const renderReport = ({ item }: { item: Report }) => (
    <View style={styles.reportCard}>
      <Text style={styles.title}>📍 {item.campus}</Text>
      <Text>🆔 User ID: {item.userId}</Text>
      <Text>🗂 Category: {item.category}</Text>
      <Text>Status: {item.status}</Text>
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
    </View>
  );
};

export default AdminLandingPage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  tabs: { flexDirection: "row", marginBottom: 10 },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#333",
  },
  tabText: {
    color: "#000",
    fontWeight: "bold",
  },
  list: { paddingBottom: 100 },
  reportCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  imagePreview: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  error: {
    color: "red",
    marginTop: 20,
    textAlign: "center",
  },
});
