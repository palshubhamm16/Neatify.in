import { useUser, useClerk } from "@clerk/clerk-expo";
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk(); // Clerk signOut method
  
  // Progress data - you can modify these values as needed
  const progressData = [
    { label: "Trees Planted", percentage: 80, target: "1.3kg to next level", current: 4 },
    { label: "Miles Walked", percentage: 70, target: "2 to next level", current: 10 },
    { label: "Activity Summary", percentage: 40, target: "6 miles to next level", current: null },
  ];

  const activityLog = [
    "You saved 1.8kg of plastic",
    "You saved 1.2kg of plastic",
    "You saved 1.7kg of plastic",
    "You saved 0.5kg of plastic",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={styles.avatar}
            defaultSource={require("../../assets/images/pink.png")}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user?.firstName || "Guest"}</Text>
            <Text style={styles.username}>@{user?.username || "username"}</Text>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </View>
        </View>

        {/* Progress Sections */}
        {progressData.map((item, index) => (
          <View key={index} style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{item.label}</Text>
              <Text style={styles.progressPercentage}>{item.percentage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${item.percentage}%` }
                ]}
              />
            </View>
            <Text style={styles.progressTarget}>{item.target}</Text>
          </View>
        ))}

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {['Email', 'Password', 'Social Accounts', 'Privacy'].map((item, index) => (
            <View key={index} style={styles.settingItem}>
              <Text style={styles.settingText}>{item}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          ))}
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <View style={styles.rewardsContainer}>
            <Text style={styles.pointsText}>Points: 1200</Text>
            <View style={styles.buttonRow}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Redeem Points</Text>
              </View>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Get Points</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Activity Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Log</Text>
          {activityLog.map((item, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark mode background
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80, // Ensuring enough space at the bottom for the logout button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Dark mode text color
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#bbb', // Dark mode secondary text color
    marginBottom: 8,
  },
  editProfile: {
    color: '#4e9fff', // Button color
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff', // Dark mode text color
  },
  progressPercentage: {
    color: '#bbb', // Dark mode text color
  },
  progressBar: {
    height: 8,
    backgroundColor: '#555', // Dark mode background for the bar
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressTarget: {
    marginTop: 4,
    color: '#bbb', // Dark mode text color
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Dark mode text color
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#555', // Dark mode divider color
  },
  settingText: {
    fontSize: 16,
    color: '#fff', // Dark mode text color
  },
  rewardsContainer: {
    backgroundColor: '#333', // Dark mode background
    borderRadius: 8,
    padding: 16,
  },
  pointsText: {
    fontSize: 16,
    color: '#fff', // Dark mode text color
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#4e9fff', // Button color
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  logItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#555', // Dark mode divider color
  },
  logText: {
    fontSize: 16,
    color: '#bbb', // Dark mode text color
  },
  logoutButton: {
    backgroundColor: '#f44336', // Red logout button color
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16, // Ensure button is not cut off
  },
  logoutText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default Profile;
