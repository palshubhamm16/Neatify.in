import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const MunicipalityMode: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [municipalityList, setMunicipalityList] = useState<{ label: string; value: string }[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = async () => {
    if (!selectedMunicipality || !description || !image) {
      Alert.alert("Please fill all fields and pick an image.");
      return;
    }

    try {
      setUploading(true);
      const token = await getToken({ template: "neatify" });

      const formData = new FormData();
      formData.append("description", description);
      formData.append("campus", selectedMunicipality); // still using 'campus' field in backend
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
      setImage(null);
    } catch (error) {
      console.error("❌ Error submitting report:", error);
      Alert.alert("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default MunicipalityMode;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingBottom: 150,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  imagePickerArea: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  placeholder: {
    borderWidth: 2,
    borderColor: "#aaa",
    borderRadius: 10,
    borderStyle: "dashed",
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  placeholderText: {
    color: "#888",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#388E3C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
