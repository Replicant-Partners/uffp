import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SimulationResult } from '../types';

interface DistributionChartProps {
  result: SimulationResult;
  ticker: string;
}

const screenWidth = Dimensions.get('window').width;

export const DistributionChart: React.FC<DistributionChartProps> = ({ result, ticker }) => {
  // Sample histogram data for visualization (every 5th point)
  const sampledHistogram = result.histogram.filter((_, i) => i % 5 === 0);

  const chartData = {
    labels: sampledHistogram.map(() => ''),
    datasets: [
      {
        data: sampledHistogram.map(h => h.count),
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#1a1a2e',
    backgroundGradientFrom: '#16213e',
    backgroundGradientTo: '#0f3460',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Probability Distribution</Text>
      <Text style={styles.subtitle}>{ticker} Revenue Outcomes</Text>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
      />

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
          <Text style={styles.legendText}>Low Probability</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#1aff92' }]} />
          <Text style={styles.legendText}>High Probability</Text>
        </View>
      </View>

      <Text style={styles.description}>
        This distribution shows the likelihood of different revenue outcomes.
        The peak represents the most probable result (P50: ${(result.p50 / 1_000_000).toFixed(1)}M).
      </Text>
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#aaa',
  },
  description: {
    fontSize: 12,
    color: '#888',
    marginTop: 16,
    lineHeight: 18,
  },
});
