import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import EnquiryForm from "./src/features/dashboard/modals/enquiry-form";
//import Membershipbilling from "./src/features/dashboard/modals/membership-billing";
// export default function App() {
//   return <Membershipbilling/>;
// }


export default function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.btnText}>+ New Enquiry</Text>
      </TouchableOpacity>

      <EnquiryForm
        visible={showForm}
        onClose={() => setShowForm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "flex-start",  // ← center se flex-start
    paddingTop: 60,                 // ← upar se thoda space
  },
  btn: {
    backgroundColor: "#0D2F5E",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});