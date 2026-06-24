import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Dashboard Screen</Text>

      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: '#000',
        }}
      >
        <Text style={{ color: '#fff' }}>Logout</Text>
      </Pressable>
    </View>
  );
}