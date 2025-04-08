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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const CampusMode: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [campusList, setCampusList] = useState<{ label: string; value: string }[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<"campus" | "room" | "helpdesk" | null>(null);

  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/campus/list`);
        const data = await res.json();
        const formatted = data.map((campus: { name: string }) => ({
          label: campus.name,
          value: campus.name,
        }));
        setCampusList(formatted);
      } catch (err) {
        console.error("Error fetching campuses:", err);
      }
    };

    const loadStoredCampus = async () => {
      if (userId) {
        const stored = await AsyncStorage.getItem(`campus_${userId}`);
        if (stored) setSelectedCampus(stored);
      }
    };

    fetchCampuses();
    loadStoredCampus();
  }, [userId]);

  const handleCampusSelect = async (value: string | null) => {
    if (userId && value) {
      await AsyncStorage.setItem(`campus_${userId}`, value);
    }
    setSelectedCampus(value);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const chooseFromGallery = async () => {
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
    if (!selectedCampus || !description || !image || !category) {
      Alert.alert("Missing info", "Please fill all fields, select a category, and upload an image.");
      return;
    }

    try {
      setUploading(true);
      const token = await getToken({ template: "neatify" });

      const formData = new FormData();
      formData.append("description", description);
      formData.append("campus", selectedCampus);
      formData.append("category", category);
      formData.append("image", {
        uri: image,
        name: "report.jpg",
        type: "image/jpeg",
      } as any);

      const res = await fetch(`${API_BASE_URL}/api/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        throw new Error("Failed to submit report");
      }

      Alert.alert("✅ Success", "Report submitted successfully!");
      setDescription("");
      setImage(null);
      setCategory(null);
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Select Your Campus</Text>

        <View style={{ zIndex: 1000, marginBottom: 30 }}>
          <DropDownPicker
            open={open}
            value={selectedCampus}
            items={campusList}
            setOpen={setOpen}
            setValue={setSelectedCampus}
            setItems={setCampusList}
            onChangeValue={handleCampusSelect}
            searchable
            placeholder="Choose your campus"
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

        <Text style={styles.label}>Select Category</Text>
        <View style={styles.buttonRow}>
          {["campus", "room", "helpdesk"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, category === cat && styles.selectedButton]}
              onPress={() => setCategory(cat as "campus" | "room" | "helpdesk")}
            >
              <Text style={styles.buttonText}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {category && (
          <Text style={styles.selectionText}>Selected: {category.toUpperCase()} </Text>
        )}

        <Text style={styles.label}>{image ? "Selected Image" : "No image selected"}</Text>
        {image ? (
          <View style={styles.imagePreview}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        ) : (
          <View style={styles.imageBox}>
            <Text style={styles.imageBoxText}>No image selected</Text>
          </View>
        )}

        <View style={styles.imageButtonsRow}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Text style={styles.photoButtonText}>📷 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={chooseFromGallery}>
            <Text style={styles.photoButtonText}>🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>

        {uploading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default CampusMode;

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#000",
  },
  selectionText: {
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
    color: "#444",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  imageBox: {
    height: 130,
    borderWidth: 2,
    borderColor: "#aaa",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  imageBoxText: {
    color: "#888",
    fontSize: 16,
  },
  imageButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  photoButton: {
    flex: 0.48,
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  photoButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  imagePreview: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#388E3C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
