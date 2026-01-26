import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { ForecastConfig, ForecastDriver } from '../types';

type CreateForecastScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateForecast'>;

export const CreateForecastScreen: React.FC<CreateForecastScreenProps> = ({ navigation }) => {
  const [ticker, setTicker] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('2027-12-31');
  const [drivers, setDrivers] = useState<ForecastDriver[]>([
    {
      name: '',
      description: '',
      distributionType: 'triangular',
      parameters: { low: 0, mode: 0, high: 0 },
      unit: '',
    },
  ]);

  const addDriver = () => {
    setDrivers([
      ...drivers,
      {
        name: '',
        description: '',
        distributionType: 'triangular',
        parameters: { low: 0, mode: 0, high: 0 },
        unit: '',
      },
    ]);
  };

  const updateDriver = (index: number, field: string, value: any) => {
    const newDrivers = [...drivers];
    if (field === 'low' || field === 'mode' || field === 'high') {
      newDrivers[index].parameters[field] = parseFloat(value) || 0;
    } else if (field === 'distributionType') {
      newDrivers[index].distributionType = value;
      // Reset parameters based on distribution type
      if (value === 'normal') {
        newDrivers[index].parameters = { mean: 0, stdDev: 0 };
      } else if (value === 'uniform') {
        newDrivers[index].parameters = { low: 0, high: 0 };
      } else if (value === 'triangular') {
        newDrivers[index].parameters = { low: 0, mode: 0, high: 0 };
      }
    } else {
      newDrivers[index][field] = value;
    }
    setDrivers(newDrivers);
  };

  const removeDriver = (index: number) => {
    if (drivers.length > 1) {
      setDrivers(drivers.filter((_, i) => i !== index));
    }
  };

  const handleCreateForecast = () => {
    // Validation
    if (!ticker.trim()) {
      Alert.alert('Error', 'Please enter a ticker symbol');
      return;
    }
    if (!targetValue || parseFloat(targetValue) <= 0) {
      Alert.alert('Error', 'Please enter a valid target value');
      return;
    }

    const hasInvalidDriver = drivers.some(
      (d) => !d.name.trim() || !d.unit.trim()
    );
    if (hasInvalidDriver) {
      Alert.alert('Error', 'Please fill in all driver fields');
      return;
    }

    const config: ForecastConfig = {
      ticker: ticker.toUpperCase(),
      targetMetric: 'revenue',
      targetValue: parseFloat(targetValue),
      targetDate: targetDate,
      drivers: drivers,
      baserate: {
        description: 'User-defined forecast',
        probability: 0.5,
        source: 'Manual entry',
      },
      premortem: [],
    };

    navigation.navigate('ForecastDetail', { config });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>

          <Text style={styles.label}>Ticker Symbol *</Text>
          <TextInput
            style={styles.input}
            value={ticker}
            onChangeText={setTicker}
            placeholder="e.g., ASTS"
            placeholderTextColor="#666"
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Target Revenue (in millions) *</Text>
          <TextInput
            style={styles.input}
            value={targetValue}
            onChangeText={setTargetValue}
            placeholder="e.g., 150"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Target Date</Text>
          <TextInput
            style={styles.input}
            value={targetDate}
            onChangeText={setTargetDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forecast Drivers</Text>
          <Text style={styles.helpText}>
            Add 2-5 independent drivers that multiply to create revenue
          </Text>

          {drivers.map((driver, index) => (
            <View key={index} style={styles.driverCard}>
              <View style={styles.driverHeader}>
                <Text style={styles.driverNumber}>Driver {index + 1}</Text>
                {drivers.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeDriver(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={driver.name}
                onChangeText={(val) => updateDriver(index, 'name', val)}
                placeholder="e.g., Subscribers"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={driver.description}
                onChangeText={(val) => updateDriver(index, 'description', val)}
                placeholder="What this driver represents"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Unit *</Text>
              <TextInput
                style={styles.input}
                value={driver.unit}
                onChangeText={(val) => updateDriver(index, 'unit', val)}
                placeholder="e.g., users, USD/month"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Distribution Type</Text>
              <View style={styles.distributionButtons}>
                {['triangular', 'normal', 'uniform'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.distributionButton,
                      driver.distributionType === type && styles.distributionButtonActive,
                    ]}
                    onPress={() => updateDriver(index, 'distributionType', type)}
                  >
                    <Text
                      style={[
                        styles.distributionButtonText,
                        driver.distributionType === type &&
                          styles.distributionButtonTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {driver.distributionType === 'triangular' && (
                <>
                  <Text style={styles.label}>Low (Pessimistic)</Text>
                  <TextInput
                    style={styles.input}
                    value={driver.parameters.low?.toString() || ''}
                    onChangeText={(val) => updateDriver(index, 'low', val)}
                    placeholder="Minimum value"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Mode (Most Likely)</Text>
                  <TextInput
                    style={styles.input}
                    value={driver.parameters.mode?.toString() || ''}
                    onChangeText={(val) => updateDriver(index, 'mode', val)}
                    placeholder="Expected value"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>High (Optimistic)</Text>
                  <TextInput
                    style={styles.input}
                    value={driver.parameters.high?.toString() || ''}
                    onChangeText={(val) => updateDriver(index, 'high', val)}
                    placeholder="Maximum value"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </>
              )}

              {driver.distributionType === 'normal' && (
                <>
                  <Text style={styles.label}>Mean (Average)</Text>
                  <TextInput
                    style={styles.input}
                    value={driver.parameters.mean?.toString() || ''}
                    onChangeText={(val) =>
                      updateDriver(index, 'mean', val)
                    }
                    placeholder="Expected average"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Standard Deviation</Text>
                  <TextInput
                    style={styles.input}
                    value={driver.parameters.stdDev?.toString() || ''}
                    onChangeText={(val) =>
                      updateDriver(index, 'stdDev', val)
                    }
                    placeholder="Spread around mean"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </>
              )}

              {driver.distributionType === 'uniform' && (
                <>
                  <Text style={styles.label}>Low (Minimum)</Text>
                  <TextInput
                    style={styles.input}
                    value={driver.parameters.low?.toString() || ''}
                    onChangeText={(val) => updateDriver(index, 'low', val)}
                    placeholder="Minimum value"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>High (Maximum)</Text>
                  <TextInput
                    style={styles.input}
                    value={driver.parameters.high?.toString() || ''}
                    onChangeText={(val) => updateDriver(index, 'high', val)}
                    placeholder="Maximum value"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addDriver}>
            <Text style={styles.addButtonText}>+ Add Another Driver</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateForecast}>
          <Text style={styles.createButtonText}>Run Forecast Simulation</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#1aff92',
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  driverCard: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1aff92',
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1aff92',
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  distributionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  distributionButton: {
    flex: 1,
    backgroundColor: '#0f3460',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#16213e',
  },
  distributionButtonActive: {
    backgroundColor: '#1aff92',
    borderColor: '#1aff92',
  },
  distributionButtonText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  distributionButtonTextActive: {
    color: '#0f3460',
  },
  addButton: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1aff92',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#1aff92',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#1aff92',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#0f3460',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
