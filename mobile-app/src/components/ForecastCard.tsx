import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ForecastConfig } from '../types';

interface ForecastCardProps {
  config: ForecastConfig;
  onPress: () => void;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ config, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.ticker}>{config.ticker}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{config.targetMetric.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.target}>
        Target: ${config.targetValue}M by {new Date(config.targetDate).getFullYear()}
      </Text>

      <View style={styles.driversContainer}>
        <Text style={styles.driversLabel}>Drivers:</Text>
        {config.drivers.slice(0, 2).map((driver, index) => (
          <Text key={index} style={styles.driverText}>
            • {driver.name} ({driver.distributionType})
          </Text>
        ))}
        {config.drivers.length > 2 && (
          <Text style={styles.driverText}>
            +{config.drivers.length - 2} more
          </Text>
        )}
      </View>

      <View style={styles.baserateContainer}>
        <Text style={styles.baserateLabel}>Base Rate:</Text>
        <Text style={styles.baserateValue}>
          {(config.baserate.probability * 100).toFixed(0)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticker: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  badge: {
    backgroundColor: '#1aff92',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f3460',
  },
  target: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 16,
  },
  driversContainer: {
    marginBottom: 12,
  },
  driversLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1aff92',
    marginBottom: 4,
  },
  driverText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  baserateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  baserateLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  baserateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1aff92',
  },
});
