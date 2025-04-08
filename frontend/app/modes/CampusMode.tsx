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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const CampusMode: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [campusList, setCampusList] = useState<{ label: string; value: string }[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/campus/list`);
        const data = await response.json();
        const formatted = data.map((campus: { name: string }) => ({
          label: campus.name,
          value: campus.name,
        }));
        setCampusList(formatted);
      } catch (error) {
        console.error("❌ Error fetching campuses:", error);
      }
    };

    fetchCampuses();
  }, []);

  const pickImage = async () => {
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
    if (!selectedCampus || !description || !image) {
      Alert.alert("Please fill all fields and select an image.");
      return;
    }

    try {
      setUploading(true);

      // 👇 Custom Clerk token with JWT template "neatify"
      const token = await getToken({ template: "neatify" });

      const formData = new FormData();
      formData.append("description", description);
      formData.append("campus", selectedCampus);
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
      setSelectedCampus(null);
    } catch (error) {
      console.error("❌ Error submitting report:", error);
      Alert.alert("Submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Campus</Text>
      <DropDownPicker
        open={open}
        value={selectedCampus}
        items={campusList}
        setOpen={setOpen}
        setValue={setSelectedCampus}
        setItems={setCampusList}
        searchable={true}
        placeholder="Choose your campus"
        containerStyle={{ zIndex: 1000, marginBottom: open ? 250 : 20 }}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter report description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Pick Image" onPress={pickImage} />

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {uploading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Submit Report" onPress={handleSubmit} color="#388E3C" />
      )}
    </View>
  );
};

export default CampusMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
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
    height: 100,
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 10,
  },
});
