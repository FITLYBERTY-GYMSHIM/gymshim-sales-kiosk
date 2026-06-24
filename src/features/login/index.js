import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Login Screen</Text>

      <Pressable
        onPress={() => navigation.navigate('Dashboard')}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: '#00000',
        }}
      >
        <Text style={{ color: '#fff' }}>Go To Dashboard</Text>
      </Pressable>
    </View>
  );
}