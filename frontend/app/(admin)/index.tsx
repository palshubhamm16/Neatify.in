import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import CampusReports from "../modesAdmin/AdminCampusReports"; // Still to be created
import MunicipalityReports from "../modesAdmin/AdminMunicipalityReports"; // Still to be created

const AdminLandingPage = () => {
  const [selectedMode, setSelectedMode] = useState<"campus" | "municipality" | null>(null);

  const handleModeSelect = (mode: "campus" | "municipality") => {
    setSelectedMode(mode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      {/* Mode Selection */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedMode === "campus" && styles.activeButton]}
          onPress={() => handleModeSelect("campus")}
        >
          <Text style={styles.buttonText}>Campus Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selectedMode === "municipality" && styles.activeButton]}
          onPress={() => handleModeSelect("municipality")}
        >
          <Text style={styles.buttonText}>Municipality Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Display Selected Reports */}
      {selectedMode === "campus" && <CampusReports />}
      {selectedMode === "municipality" && <MunicipalityReports />}
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4CAF50",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#388E3C",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
