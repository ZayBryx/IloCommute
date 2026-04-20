import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { NavigationGuideProps } from "@/types";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";

const NavigationGuide = ({
  directRoute,
  transferRoute,
  onClose,
  mapRef,
  currentStep,
  setCurrentStep,
  setNavigating,
}: NavigationGuideProps) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const totalSteps = directRoute ? 3 : transferRoute ? 5 : 0;
  const route = directRoute || transferRoute;

  if (!route) return null;

  const focusOnSegment = (stepIndex: number) => {
    if (!mapRef?.current) return;

    let location;

    if (directRoute) {
      switch (stepIndex) {
        case 0:
          location = directRoute.segments.walkToPickup.origin;
          break;
        case 1:
          location = directRoute.segments.jeepneyPath.origin;
          break;
        case 2:
          location = directRoute.segments.walkFromDropoff.origin;
          break;
      }
    } else if (transferRoute) {
      switch (stepIndex) {
        case 0:
          location = transferRoute.segments.walkToPickup.origin;
          break;
        case 1:
          location = transferRoute.segments.firstJeepney.origin;
          break;
        case 2:
          location = transferRoute.segments.transferWalk.origin;
          break;
        case 3:
          location = transferRoute.segments.secondJeepney.origin;
          break;
        case 4:
          location = transferRoute.segments.walkFromDropoff.origin;
          break;
      }
    }

    if (location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    }
  };

  const handleStepPress = (stepIndex: number) => {
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
      focusOnSegment(stepIndex);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      focusOnSegment(nextStep);
    } else {
      setNavigating(false);
      setCurrentStep(0);
      router.push("/user/feedback");
    }
  };

  const getCurrentSegment = () => {
    if (directRoute) {
      switch (currentStep) {
        case 0:
          return {
            type: "walk",
            icon: (
              <MaterialIcons
                name="directions-walk"
                size={24}
                color={theme.colors.text}
              />
            ),
            action: "Walk to",
            address: directRoute.segments.walkToPickup.address,
            duration: directRoute.segments.walkToPickup.duration.text,
            distance: directRoute.segments.walkToPickup.distance.text,
          };
        case 1:
          return {
            type: "jeepney",
            icon: (
              <FontAwesome5 name="bus" size={24} color={theme.colors.text} />
            ),
            action: "Ride Jeepney",
            address: directRoute.route.routeName,
            duration: directRoute.segments.jeepneyPath.duration.text,
            distance: directRoute.segments.jeepneyPath.distance.text,
            fare: {
              modernized: {
                discounted:
                  directRoute.segments.jeepneyPath.fare_estimation.modernized
                    .discounted,
                regular:
                  directRoute.segments.jeepneyPath.fare_estimation.modernized
                    .regular,
              },
              traditional: {
                discounted:
                  directRoute.segments.jeepneyPath.fare_estimation.traditional
                    .discounted,
                regular:
                  directRoute.segments.jeepneyPath.fare_estimation.traditional
                    .regular,
              },
            },
          };
        case 2:
          return {
            type: "walk",
            icon: (
              <MaterialIcons name="place" size={24} color={theme.colors.text} />
            ),
            action: "Walk to",
            address: directRoute.segments.walkFromDropoff.address,
            duration: directRoute.segments.walkFromDropoff.duration.text,
            distance: directRoute.segments.walkFromDropoff.distance.text,
          };
      }
    } else if (transferRoute) {
      switch (currentStep) {
        case 0:
          return {
            type: "walk",
            icon: (
              <MaterialIcons
                name="directions-walk"
                size={24}
                color={theme.colors.text}
              />
            ),
            action: "Walk to",
            address: transferRoute.segments.walkToPickup.address,
            duration: transferRoute.segments.walkToPickup.duration.text,
            distance: transferRoute.segments.walkToPickup.distance.text,
          };
        case 1:
          return {
            type: "jeepney",
            icon: (
              <FontAwesome5 name="bus" size={24} color={theme.colors.text} />
            ),
            action: "Ride Jeepney",
            address: transferRoute.routes[0].routeName,
            duration: transferRoute.segments.firstJeepney.duration.text,
            distance: transferRoute.segments.firstJeepney.distance.text,
            fare: {
              modernized: {
                discounted:
                  transferRoute.segments.firstJeepney.fare_estimation.modernized
                    .discounted,
                regular:
                  transferRoute.segments.firstJeepney.fare_estimation.modernized
                    .regular,
              },
              traditional: {
                discounted:
                  transferRoute.segments.firstJeepney.fare_estimation
                    .traditional.discounted,
                regular:
                  transferRoute.segments.firstJeepney.fare_estimation
                    .traditional.regular,
              },
            },
          };
        case 2:
          return {
            type: "transfer",
            icon: (
              <MaterialIcons
                name="transfer-within-a-station"
                size={24}
                color={theme.colors.text}
              />
            ),
            action: "Transfer at",
            address: transferRoute.segments.transferWalk.address,
            duration: transferRoute.segments.transferWalk.duration.text,
            distance: transferRoute.segments.transferWalk.distance.text,
          };
        case 3:
          return {
            type: "jeepney",
            icon: (
              <FontAwesome5 name="bus" size={24} color={theme.colors.text} />
            ),
            action: "Ride Jeepney",
            address: transferRoute.routes[1].routeName,
            duration: transferRoute.segments.secondJeepney.duration.text,
            distance: transferRoute.segments.secondJeepney.distance.text,
            fare: {
              modernized: {
                discounted:
                  transferRoute.segments.secondJeepney.fare_estimation
                    .modernized.discounted,
                regular:
                  transferRoute.segments.secondJeepney.fare_estimation
                    .modernized.regular,
              },
              traditional: {
                discounted:
                  transferRoute.segments.secondJeepney.fare_estimation
                    .traditional.discounted,
                regular:
                  transferRoute.segments.secondJeepney.fare_estimation
                    .traditional.regular,
              },
            },
          };
        case 4:
          return {
            type: "walk",
            icon: (
              <MaterialIcons name="place" size={24} color={theme.colors.text} />
            ),
            action: "Walk to",
            address: transferRoute.segments.walkFromDropoff.address,
            duration: transferRoute.segments.walkFromDropoff.duration.text,
            distance: transferRoute.segments.walkFromDropoff.distance.text,
          };
      }
    }
  };

  const segment = getCurrentSegment();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    progressContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    progressButton: {
      flex: 1,
      alignItems: "center",
    },
    progressDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.cardBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    activeDot: {
      backgroundColor: theme.colors.primary,
    },
    completedDot: {
      backgroundColor: theme.colors.success,
    },
    disabledDot: {
      backgroundColor: theme.colors.border,
      opacity: 0.5,
    },
    progressNumber: {
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    activeNumber: {
      color: theme.colors.buttonText,
    },
    disabledNumber: {
      color: theme.colors.textSecondary,
    },
    cardContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      marginRight: 16,
    },
    contentContainer: {
      flex: 1,
      paddingVertical: 2,
    },
    actionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 0,
    },
    addressText: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 1,
      color: theme.colors.text,
    },
    metricsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 1,
    },
    metricText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    nextButtonText: {
      color: theme.colors.buttonText,
      fontSize: 16,
      fontWeight: "600",
    },
    contentWrapper: {
      gap: 16,
    },
    progressLine: {
      position: "absolute",
      top: 15,
      left: "50%",
      width: "100%",
      height: 2,
      backgroundColor: theme.colors.border,
      zIndex: -1,
    },
    completedLine: {
      backgroundColor: theme.colors.success,
    },
    activeLine: {
      backgroundColor: theme.colors.primary,
    },
    fareContainer: {
      marginTop: 2,
    },
    fareSection: {
      marginTop: 2,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 2,
    },
    fareHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fareHeaderText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    fareDetail: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    fareDetailText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 2,
    },
  });

  return (
    <View style={styles.container}>
      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleStepPress(index)}
            style={styles.progressButton}
            activeOpacity={index <= currentStep + 1 ? 0.7 : 1}
          >
            <View
              style={[
                styles.progressDot,
                currentStep === index && styles.activeDot,
                currentStep > index && styles.completedDot,
                index > currentStep + 1 && styles.disabledDot,
              ]}
            >
              <Text
                style={[
                  styles.progressNumber,
                  (currentStep === index || currentStep > index) &&
                    styles.activeNumber,
                  index > currentStep + 1 && styles.disabledNumber,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.progressLine,
                  currentStep > index && styles.completedLine,
                  currentStep === index && styles.activeLine,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Step Card and Next Button Container */}
      <View style={styles.contentWrapper}>
        {/* Current Step Card */}
        <View style={styles.cardContainer}>
          <View style={styles.iconContainer}>{segment?.icon}</View>
          <View style={styles.contentContainer}>
            <Text style={styles.actionText}>{segment?.action}</Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {segment?.address}
            </Text>
            <View style={styles.metricsContainer}>
              <Text style={styles.metricText}>{segment?.duration}</Text>
              <Text style={styles.metricText}> • </Text>
              <Text style={styles.metricText}>{segment?.distance}</Text>
            </View>
            {segment?.fare && (
              <View style={styles.fareContainer}>
                <View style={styles.fareSection}>
                  <View style={styles.fareHeader}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="jeepney"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.fareHeaderText}>Traditional</Text>
                    </View>
                    <View style={styles.fareDetail}>
                      <MaterialCommunityIcons
                        name="account"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.fareDetailText}>
                        ₱{segment.fare.traditional.regular}
                      </Text>
                    </View>
                    <View style={styles.fareDetail}>
                      <MaterialCommunityIcons
                        name="card-account-details"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.fareDetailText}>
                        ₱{segment.fare.traditional.discounted}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.fareSection}>
                  <View style={styles.fareHeader}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <MaterialIcons
                        name="directions-bus"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.fareHeaderText}>Modernized</Text>
                    </View>
                    <View style={styles.fareDetail}>
                      <MaterialCommunityIcons
                        name="account"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.fareDetailText}>
                        ₱{segment.fare.modernized.regular}
                      </Text>
                    </View>
                    <View style={styles.fareDetail}>
                      <MaterialCommunityIcons
                        name="card-account-details"
                        size={16}
                        color="#666"
                      />
                      <Text style={styles.fareDetailText}>
                        ₱{segment.fare.modernized.discounted}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavigationGuide;
