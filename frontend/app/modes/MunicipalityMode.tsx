// MunicipalityMode.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapPickerModal from "../../components/MapPickerModal"; // 👈 Add this import

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const MunicipalityMode: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [municipalityList, setMunicipalityList] = useState<{ label: string; value: string }[]>([]);
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/municipality/list`);
        const data = await response.json();
        const formatted = data.map((m: { name: string }) => ({
          label: m.name,
          value: m.name,
        }));
        setMunicipalityList(formatted);
      } catch (error) {
        console.error("❌ Error fetching municipalities:", error);
      }
    };

    const loadStoredMunicipality = async () => {
      if (userId) {
        const stored = await AsyncStorage.getItem(`municipality_${userId}`);
        if (stored) setSelectedMunicipality(stored);
      }
    };

    fetchMunicipalities();
    loadStoredMunicipality();
  }, [userId]);

  const handleMunicipalitySelect = async (val: string | null) => {
    if (userId && val) {
      await AsyncStorage.setItem(`municipality_${userId}`, val);
    }
    setSelectedMunicipality(val);
  };

  const pickImageFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (err) {
      console.error("❌ Error fetching location:", err);
      Alert.alert("Could not fetch location");
    }
  };

  const handleSubmit = async () => {
    if (!selectedMunicipality || !description || !area || !image || !location) {
      Alert.alert("Please fill all fields, upload an image, and get your location.");
      return;
    }

    try {
      setUploading(true);
      const token = await getToken({ template: "neatify" });

      const formData = new FormData();
      formData.append("description", description);
      formData.append("area", area);
      formData.append("campus", selectedMunicipality);
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
      formData.append("image", {
        uri: image,
        name: "report.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Server response:", text);
        throw new Error("Submission failed.");
      }

      Alert.alert("✅ Report submitted!");
      setDescription("");
      setArea("");
      setImage(null);
      setLocation(null);
    } catch (error) {
      console.error("❌ Error submitting report:", error);
      Alert.alert("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { flexGrow: 1, paddingBottom: 100 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Municipality Report</Text>

          <View style={{ zIndex: 1000, marginBottom: 30 }}>
            <DropDownPicker
              open={open}
              value={selectedMunicipality}
              items={municipalityList}
              setOpen={setOpen}
              setValue={setSelectedMunicipality}
              setItems={setMunicipalityList}
              onChangeValue={handleMunicipalitySelect}
              searchable={true}
              placeholder="Choose your municipality"
              listMode="MODAL"
              modalProps={{ animationType: "slide" }}
              modalContentContainerStyle={{ backgroundColor: "#fff", padding: 20 }}
              style={{ borderColor: "#ccc" }}
              textStyle={{ color: "#000" }}
            />
          </View>

          <TextInput
            style={[styles.input, { height: 60, color: "#000" }]}
            placeholder="Enter report description"
            placeholderTextColor="#888"
            multiline
            numberOfLines={2}
            maxLength={200}
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={[styles.input, { height: 50, color: "#000" }]}
            placeholder="Enter area name"
            placeholderTextColor="#888"
            value={area}
            onChangeText={setArea}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={fetchLocation} style={styles.optionButton}>
              <Text style={styles.optionText}>📍 Get Current Location</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMapModalVisible(true)} style={styles.optionButton}>
              <Text style={styles.optionText}>🗺️ Pick Location from Map</Text>
            </TouchableOpacity>
          </View>

          {location && (
            <Text style={{ color: "#555", marginBottom: 10 }}>
              Latitude: {location.latitude.toFixed(5)}, Longitude: {location.longitude.toFixed(5)}
            </Text>
          )}

          <View style={styles.imagePickerArea}>
            <Text style={styles.label}>
              {image ? "Selected Image:" : "No image selected"}
            </Text>

            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={pickImageFromCamera} style={styles.optionButton}>
                <Text style={styles.optionText}>📸 Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImageFromGallery} style={styles.optionButton}>
                <Text style={styles.optionText}>🖼️ Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>

          {uploading ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>Submit Report</Text>
            </TouchableOpacity>
          )}

          <Modal visible={mapModalVisible} animationType="slide">
            <MapPickerModal
              onClose={() => setMapModalVisible(false)}
              onLocationSelect={(coords) => {
                setLocation(coords);
                setMapModalVisible(false);
              }}
            />
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePickerArea: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholder: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: {
    color: "#888",
  },
  submitButton: {
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MunicipalityMode;
