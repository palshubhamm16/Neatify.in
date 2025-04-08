import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Platform } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface Report {
  _id: string;
  imageUrl: string;
  description: string;
  location: string;
  createdAt: string;
}

const AdminLandingPage = () => {
  const { getToken } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${BASE_URL}/api/reports/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data.reports || []);
    } catch (err: any) {
      setError(err.message || "Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Reports</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : reports.length === 0 ? (
        <Text style={styles.noReports}>No reports available for your campus.</Text>
      ) : (
        <ScrollView style={styles.scroll}>
          {reports.map((report) => (
            <View key={report._id} style={styles.card}>
              <Image source={{ uri: report.imageUrl }} style={styles.image} />
              <Text style={styles.label}>Location:</Text>
              <Text>{report.location}</Text>
              <Text style={styles.label}>Description:</Text>
              <Text>{report.description}</Text>
              <Text style={styles.timestamp}>
                {new Date(report.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default AdminLandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4CAF50",
  },
  scroll: {
    width: "100%",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 5,
  },
  timestamp: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
  noReports: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
