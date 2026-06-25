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