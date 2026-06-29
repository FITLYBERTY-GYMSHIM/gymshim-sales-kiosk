import AppNavigator from './src/features/app-navigator';

export default function App() {
  return <AppNavigator />;
}


{/* <TouchableOpacity
              style={[styles.payBtn, loading && { opacity: 0.7 }]}
              onPress={() => { if (validate()) { console.log("Proceed to pay", form, "Amount:", payable); } }}
            ></TouchableOpacity> */}