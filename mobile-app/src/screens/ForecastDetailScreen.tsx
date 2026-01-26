import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ForecastChart } from '../components/ForecastChart';
import { DistributionChart } from '../components/DistributionChart';
import { forecastService } from '../services/forecastService';
import { SimulationResult } from '../types';
import { RootStackParamList } from '../App';

type ForecastDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ForecastDetail'>;

export const ForecastDetailScreen: React.FC<ForecastDetailScreenProps> = ({ route }) => {
  const { config } = route.params;
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runSimulation();
  }, []);

  const runSimulation = async () => {
    setLoading(true);
    const simResult = await forecastService.runSimulation(config.drivers);

    // Calculate probability above target
    const aboveTarget = simResult.histogram
      .filter(h => h.value >= config.targetValue * 1_000_000)
      .reduce((sum, h) => sum + h.count, 0);

    simResult.probabilityAboveTarget = aboveTarget / 10000;

    setResult(simResult);
    setLoading(false);
  };

  if (loading || !result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1aff92" />
          <Text style={styles.loadingText}>Running Monte Carlo Simulation...</Text>
          <Text style={styles.loadingSubtext}>10,000 iterations</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.ticker}>{config.ticker}</Text>
          <Text style={styles.target}>
            Target: ${config.targetValue}M by {new Date(config.targetDate).getFullYear()}
          </Text>
        </View>

        <View style={styles.probabilityCard}>
          <Text style={styles.probabilityLabel}>Success Probability</Text>
          <Text style={styles.probabilityValue}>
            {(result.probabilityAboveTarget * 100).toFixed(1)}%
          </Text>
          <Text style={styles.probabilityDescription}>
            Probability of reaching ${config.targetValue}M target
          </Text>
        </View>

        <ForecastChart result={result} ticker={config.ticker} />

        <DistributionChart result={result} ticker={config.ticker} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forecast Drivers</Text>
          {config.drivers.map((driver, index) => (
            <View key={index} style={styles.driverCard}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverDescription}>{driver.description}</Text>
              <View style={styles.driverParams}>
                <Text style={styles.driverType}>
                  Distribution: {driver.distributionType}
                </Text>
                <Text style={styles.driverUnit}>Unit: {driver.unit}</Text>
              </View>
              <View style={styles.paramsList}>
                {Object.entries(driver.parameters).map(([key, value]) => (
                  <Text key={key} style={styles.paramItem}>
                    {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outside View (Base Rate)</Text>
          <View style={styles.baserateCard}>
            <Text style={styles.baserateText}>{config.baserate.description}</Text>
            <View style={styles.baserateFooter}>
              <Text style={styles.baserateProb}>
                {(config.baserate.probability * 100).toFixed(0)}% historical success rate
              </Text>
              <Text style={styles.baserateSource}>Source: {config.baserate.source}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pre-Mortem Analysis</Text>
          {config.premortem.map((pm, index) => (
            <View key={index} style={styles.premortemCard}>
              <Text style={styles.premortemScenario}>{pm.scenario}</Text>
              <Text style={styles.premortemFailure}>{pm.failureMode}</Text>
            </View>
          ))}
        </View>

        <View style={styles.methodologySection}>
          <Text style={styles.methodologyTitle}>Methodology</Text>
          <Text style={styles.methodologyText}>
            This forecast uses Tetlock Superforecasting methodology with Monte Carlo simulation.
            Independent drivers are sampled from specified distributions 10,000 times to generate
            a probability distribution of outcomes. The P10/P50/P90 values represent the 10th,
            50th, and 90th percentiles of this distribution.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  header: {
    marginBottom: 20,
  },
  ticker: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  target: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  probabilityCard: {
    backgroundColor: '#16213e',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1aff92',
  },
  probabilityLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  probabilityValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1aff92',
  },
  probabilityDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  driverCard: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1aff92',
    marginBottom: 4,
  },
  driverDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
  },
  driverParams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  driverType: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  driverUnit: {
    fontSize: 12,
    color: '#888',
  },
  paramsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  paramItem: {
    fontSize: 12,
    color: '#aaa',
    backgroundColor: '#0f3460',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  baserateCard: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
  },
  baserateText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 20,
  },
  baserateFooter: {
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
    paddingTop: 12,
  },
  baserateProb: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1aff92',
    marginBottom: 4,
  },
  baserateSource: {
    fontSize: 12,
    color: '#888',
  },
  premortemCard: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  premortemScenario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 4,
  },
  premortemFailure: {
    fontSize: 14,
    color: '#aaa',
  },
  methodologySection: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  methodologyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1aff92',
    marginBottom: 8,
  },
  methodologyText: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 18,
  },
});
