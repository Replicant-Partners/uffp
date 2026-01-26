import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ForecastCard } from '../components/ForecastCard';
import { forecastService } from '../services/forecastService';
import { RootStackParamList } from '../App';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const forecasts = forecastService.getExampleForecasts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UFFP Forecasts</Text>
        <Text style={styles.subtitle}>Tetlock Probabilistic Forecasting</Text>
      </View>

      <FlatList
        data={forecasts}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => (
          <ForecastCard
            config={item}
            onPress={() => navigation.navigate('ForecastDetail', { config: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#1aff92',
  },
  listContent: {
    paddingBottom: 20,
  },
});
