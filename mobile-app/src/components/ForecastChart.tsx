import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SimulationResult } from '../types';

interface ForecastChartProps {
  result: SimulationResult;
  ticker: string;
}

const screenWidth = Dimensions.get('window').width;

export const ForecastChart: React.FC<ForecastChartProps> = ({ result, ticker }) => {
  const toMillions = (value: number) => value / 1_000_000;

  const chartData = {
    labels: ['P10\nBear', 'P50\nBase', 'P90\nBull'],
    datasets: [
      {
        data: [toMillions(result.p10), toMillions(result.p50), toMillions(result.p90)],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#1a1a2e',
    backgroundGradientFrom: '#16213e',
    backgroundGradientTo: '#0f3460',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ticker} Revenue Forecast</Text>
      <Text style={styles.subtitle}>Monte Carlo Simulation (10k iterations)</Text>

      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="$"
        yAxisSuffix="M"
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
      />

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Mean:</Text>
          <Text style={styles.statValue}>${toMillions(result.mean).toFixed(2)}M</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Std Dev:</Text>
          <Text style={styles.statValue}>${toMillions(result.stdDev).toFixed(2)}M</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Confidence Range:</Text>
          <Text style={styles.statValue}>
            {(((result.p90 - result.p10) / result.p50) * 100).toFixed(0)}% variance
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#16213e',
    borderRadius: 16,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  statsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#0f3460',
    borderRadius: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1aff92',
  },
});
