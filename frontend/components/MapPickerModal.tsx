// MapPickerModal.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";

const screen = Dimensions.get("screen");

const MapPickerModal = ({
  onClose,
  onLocationSelect,
}: {
  onClose: () => void;
  onLocationSelect: (coords: { latitude: number; longitude: number }) => void;
}) => {
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const coords = event.nativeEvent.coordinate;
    setMarker(coords);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 28.6139,
          longitude: 77.209,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={handleMapPress}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (marker) onLocationSelect(marker);
          }}
          style={[styles.saveButton, !marker && { backgroundColor: "#ccc" }]}
          disabled={!marker}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapPickerModal;

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#999",
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  saveButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
