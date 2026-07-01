import React from 'react';
import { View, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <View>
      <Text>Login Screen</Text>

      <Pressable
        onPress={() => navigation.navigate('Dashboard')}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: '#000',
        }}
      >
        <Text style={{ color: '#fff' }}>Go To Dashboard</Text>
      </Pressable>
    </View>
  );
}

// import React, { useState } from 'react';
// import { View, Text, Pressable } from 'react-native';
// import OtpModal from '../../components/otp/index';

// export default function LoginScreen() {
//   const [showOtp, setShowOtp] = useState(false);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6F9' }}>
//       <Text style={{ fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 30 }}>
//         GymShim Kiosk
//       </Text>

//       <Pressable
//         onPress={() => setShowOtp(true)}
//         style={{
//           backgroundColor: '#0A5A7E',
//           paddingVertical: 14,
//           paddingHorizontal: 32,
//           borderRadius: 12,
//         }}
//       >
//         <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
//           Open OTP Login
//         </Text>
//       </Pressable>

//       <OtpModal
//         visible={showOtp}
//         onClose={() => setShowOtp(false)}
//         onSuccess={(token) => {
//           console.log('✅ Token received:', token);
//           alert(`Login successful!\nToken: ${token}`);
//           setShowOtp(false);
//         }}
//       />
//     </View>
//   );
// }