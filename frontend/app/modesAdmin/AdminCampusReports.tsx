import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

const AdminCampusReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;
      const res = await fetch(`${API_BASE_URL}/api/reports/campus`);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching campus reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Campus Reports</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : reports.length === 0 ? (
        <Text>No reports found.</Text>
      ) : (
        reports.map((report: any, index: number) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>Campus:</Text>
            <Text>{report.campus}</Text>

            <Text style={styles.label}>Description:</Text>
            <Text>{report.description}</Text>

            {report.imageUrl && (
              <Text style={{ color: "blue", marginTop: 5 }}>
                📷 Image: {report.imageUrl}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default AdminCampusReports;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontWeight: "bold",
    marginTop: 5,
  },
});
