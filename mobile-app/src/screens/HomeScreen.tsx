import React from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForecastCard } from "../components/ForecastCard";
import { forecastService } from "../services/forecastService";
import { RootStackParamList } from "../App";
import { TufteColors, TufteTypography, TufteSpacing, TufteLayout } from "../styles/tufte";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const forecasts = forecastService.getExampleForecasts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Probabilistic Forecasting</Text>
        <Text style={styles.subtitle}>
          Tetlock Superforecasting methodology — Monte Carlo simulation — Brier scoring
        </Text>
      </View>

      <View style={styles.createSection}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateForecast")}
        >
          <Text style={styles.createButtonText}>New Forecast</Text>
        </TouchableOpacity>
        <Text style={styles.createHint}>
          Build probabilistic predictions with explicit uncertainty quantification
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Example Forecasts</Text>

      <FlatList
        data={forecasts}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) => (
          <ForecastCard
            config={item}
            onPress={() => navigation.navigate("ForecastDetail", { config: item })}
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
    backgroundColor: TufteColors.background,
  },
  header: {
    paddingHorizontal: TufteLayout.marginHorizontal,
    paddingTop: TufteSpacing.xl,
    paddingBottom: TufteSpacing.lg,
  },
  title: {
    fontSize: TufteTypography.fontSize.display,
    fontWeight: TufteTypography.fontWeight.normal,
    color: TufteColors.text,
    letterSpacing: -0.5,
    marginBottom: TufteSpacing.sm,
  },
  subtitle: {
    fontSize: TufteTypography.fontSize.sm,
    color: TufteColors.textSecondary,
    lineHeight: TufteTypography.lineHeight.relaxed * TufteTypography.fontSize.sm,
    maxWidth: TufteLayout.maxWidth,
  },
  createSection: {
    paddingHorizontal: TufteLayout.marginHorizontal,
    marginBottom: TufteSpacing.lg,
  },
  createButton: {
    borderWidth: 1,
    borderColor: TufteColors.text,
    paddingVertical: TufteSpacing.md,
    paddingHorizontal: TufteSpacing.lg,
    alignSelf: "flex-start",
    marginBottom: TufteSpacing.sm,
  },
  createButtonText: {
    fontSize: TufteTypography.fontSize.base,
    color: TufteColors.text,
    fontWeight: TufteTypography.fontWeight.medium,
    letterSpacing: 0.3,
  },
  createHint: {
    fontSize: TufteTypography.fontSize.xs,
    color: TufteColors.textTertiary,
    lineHeight: TufteTypography.lineHeight.relaxed * TufteTypography.fontSize.xs,
    maxWidth: 300,
  },
  divider: {
    height: 1,
    backgroundColor: TufteColors.grid,
    marginHorizontal: TufteLayout.marginHorizontal,
    marginVertical: TufteSpacing.lg,
  },
  sectionLabel: {
    fontSize: TufteTypography.fontSize.xs,
    color: TufteColors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: TufteLayout.marginHorizontal,
    marginBottom: TufteSpacing.md,
  },
  listContent: {
    paddingBottom: TufteSpacing.xxl,
  },
});
