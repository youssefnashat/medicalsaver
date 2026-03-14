import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocation } from './useLocation';

export default function LocationDisplay() {
  const { address, loading, error, getAddress } = useLocation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={getAddress} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Getting location...' : 'Get My Address'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      {address && (
        <View style={styles.result}>
          <Text style={styles.label}>📍 Your Address:</Text>
          <Text style={styles.address}>{address.display_name}</Text>

          {/* Individual address parts if you need them */}
          {address.address.road && <Text style={styles.detail}>Street: {address.address.road}</Text>}
          {address.address.city && <Text style={styles.detail}>City: {address.address.city}</Text>}
          {address.address.postcode && <Text style={styles.detail}>Postcode: {address.address.postcode}</Text>}
          {address.address.country && <Text style={styles.detail}>Country: {address.address.country}</Text>}
        </View>
      )}

      {error && <Text style={styles.error}>Error: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  result: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  detail: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontSize: 14,
  },
});
