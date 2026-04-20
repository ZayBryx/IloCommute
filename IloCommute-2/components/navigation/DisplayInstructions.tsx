import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { DisplayInstructionsProps } from "@/types";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import NavigationGuide from "./NavigationGuide";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import React from "react";

const DisplayInstructions = ({
  directRoute,
  transferRoute,
  mapRef,
  navigating,
  setNavigating,
  currentStep,
  setCurrentStep,
}: DisplayInstructionsProps) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleStartNavigation = () => {
    setNavigating(true);
  };

  const handleCloseNavigation = () => {
    setNavigating(false);
  };

  const handleCardPress = (
    stepNumber: number,
    type: "walk" | "jeepney" | "transfer"
  ) => {
    if (!mapRef?.current) return;

    let location;

    if (directRoute) {
      switch (stepNumber) {
        case 1:
          location = directRoute.segments.walkToPickup.origin;
          break;
        case 2:
          location = directRoute.segments.jeepneyPath.origin;
          break;
        case 3:
          location = directRoute.segments.walkFromDropoff.origin;
          break;
      }
    } else if (transferRoute) {
      switch (stepNumber) {
        case 1:
          location = transferRoute.segments.walkToPickup.origin;
          break;
        case 2:
          location = transferRoute.segments.firstJeepney.origin;
          break;
        case 3:
          location = transferRoute.segments.transferWalk.origin;
          break;
        case 4:
          location = transferRoute.segments.secondJeepney.origin;
          break;
        case 5:
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 10,
    },
    timelineContainer: {
      flex: 1,
      flexGrow: 1,
    },
    timelineItem: {
      flexDirection: "row",
      marginBottom: 24,
    },
    timelineLeft: {
      alignItems: "center",
      width: 40,
    },
    timelineNumber: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.colors.cardBackground,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      elevation: 2,
    },
    timelineNumberText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    timelineLine: {
      width: 2,
      flex: 1,
      backgroundColor: theme.colors.border,
      position: "absolute",
      top: 34,
      bottom: -24,
      left: "50%",
      marginLeft: -1,
    },
    timelineContent: {
      flex: 1,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginLeft: 12,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    instructionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    iconContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: 8,
      elevation: 2,
    },
    instructionTextContainer: {
      flex: 1,
    },
    addressText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
      fontStyle: "italic",
    },
    instructionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      marginLeft: 2,
    },
    detailsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    detailText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    dotSeparator: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    jeepneyBox: {
      borderRadius: 8,
      padding: 8,
      minWidth: 32,
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      elevation: 2,
    },
    jeepneyNumber: {
      color: theme.colors.buttonText,
      fontWeight: "600",
      fontSize: 14,
    },
    fareContainer: {
      marginTop: 8,
      flexDirection: "column",
      gap: 8,
    },
    fareSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 8,
    },
    fareHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 8,
    },
    fareTypeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    fareHeaderText: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    fareDetailsRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: 20,
      marginBottom: 4,
    },
    fareDetail: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    fareDetailText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    noRouteText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    verticalLine: {
      width: 2,
      flex: 1,
      backgroundColor: theme.colors.border,
      position: "absolute",
      top: 34,
      bottom: -24,
      left: "50%",
      marginLeft: -1,
    },
    mainContainer: {
      flex: 1,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 8,
      margin: 16,
      gap: 8,
      elevation: 3,
      width: "96%",
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    startButtonText: {
      color: theme.colors.buttonText,
      fontSize: 16,
      fontWeight: "600",
    },
    timelineContentPressed: {
      backgroundColor: theme.colors.surface,
      transform: [{ scale: 0.98 }],
    },
  });

  if (!directRoute && !transferRoute) {
    return (
      <View style={styles.container}>
        <Text style={styles.noRouteText}>No route selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {!navigating ? (
        <>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartNavigation}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="navigation"
              size={24}
              color={theme.colors.buttonText}
            />
            <Text style={styles.startButtonText}>Start Navigation</Text>
          </TouchableOpacity>

          <ScrollView style={styles.scrollContainer}>
            {/* Direct Route Instructions */}
            {directRoute && (
              <View style={styles.timelineContainer}>
                {/* Step 1: Initial Walk */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(1, "walk")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>1</Text>
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Walk to</Text>
                      <View style={styles.instructionRow}>
                        <View style={styles.iconContainer}>
                          <MaterialIcons
                            name="directions-walk"
                            size={24}
                            color={theme.colors.buttonText}
                          />
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText}>
                            {directRoute.segments.walkToPickup.address}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>
                          {directRoute.segments.walkToPickup.duration.text}
                        </Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.detailText}>
                          {directRoute.segments.walkToPickup.distance.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Step 2: Jeepney Ride */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(2, "jeepney")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>2</Text>
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Ride Jeepney</Text>
                      <View style={styles.instructionRow}>
                        <View
                          style={[
                            styles.jeepneyBox,
                            { backgroundColor: directRoute.route.routeColor },
                          ]}
                        >
                          <FontAwesome5 name="bus" size={18} color="#fff" />
                          <Text style={styles.jeepneyNumber}>
                            {directRoute.route.routeNo}
                          </Text>
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText} numberOfLines={2}>
                            {directRoute.route.routeName}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.fareContainer}>
                        <View style={styles.detailsRow}>
                          <MaterialIcons
                            name="access-time"
                            size={16}
                            color="#666"
                          />
                          <Text style={styles.fareDetailText}>
                            {directRoute.segments.jeepneyPath.duration.text}
                          </Text>
                          <MaterialIcons
                            name="straighten"
                            size={16}
                            color="#666"
                          />
                          <Text style={styles.fareDetailText}>
                            {directRoute.segments.jeepneyPath.distance.text}
                          </Text>
                        </View>
                        <View style={styles.fareSection}>
                          <View style={styles.fareHeader}>
                            <View style={styles.fareTypeContainer}>
                              <MaterialCommunityIcons
                                name="jeepney"
                                size={20}
                                color="#666"
                              />
                              <Text style={styles.fareHeaderText}>
                                Traditional
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  directRoute.segments.jeepneyPath
                                    .fare_estimation.traditional.regular
                                }
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="card-account-details"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  directRoute.segments.jeepneyPath
                                    .fare_estimation.traditional.discounted
                                }
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.fareSection}>
                          <View style={styles.fareHeader}>
                            <View style={styles.fareTypeContainer}>
                              <MaterialIcons
                                name="directions-bus"
                                size={20}
                                color="#666"
                              />
                              <Text style={styles.fareHeaderText}>
                                Modernized
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  directRoute.segments.jeepneyPath
                                    .fare_estimation.modernized.regular
                                }
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="card-account-details"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  directRoute.segments.jeepneyPath
                                    .fare_estimation.modernized.discounted
                                }
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Step 3: Final Walk */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(3, "walk")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>3</Text>
                      </View>
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Get Off</Text>
                      <View style={styles.instructionRow}>
                        <View style={styles.iconContainer}>
                          <MaterialIcons name="place" size={24} color="#fff" />
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText} numberOfLines={2}>
                            {directRoute.segments.walkFromDropoff.address}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>
                          {directRoute.segments.walkFromDropoff.duration.text}
                        </Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.detailText}>
                          {directRoute.segments.walkFromDropoff.distance.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Transfer Route Instructions */}
            {transferRoute && (
              <View style={styles.timelineContainer}>
                {/* Step 1: Initial Walk */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(1, "walk")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>1</Text>
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Walk to</Text>
                      <View style={styles.instructionRow}>
                        <View style={styles.iconContainer}>
                          <MaterialIcons
                            name="directions-walk"
                            size={24}
                            color={theme.colors.buttonText}
                          />
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText}>
                            {transferRoute.segments.walkToPickup.address}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>
                          {transferRoute.segments.walkToPickup.duration.text}
                        </Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.detailText}>
                          {transferRoute.segments.walkToPickup.distance.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Step 2: First Jeepney */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(2, "jeepney")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>2</Text>
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Ride Jeepney</Text>
                      <View style={styles.instructionRow}>
                        <View
                          style={[
                            styles.jeepneyBox,
                            {
                              backgroundColor:
                                transferRoute.routes[0].routeColor,
                            },
                          ]}
                        >
                          <FontAwesome5 name="bus" size={18} color="#fff" />
                          <Text style={styles.jeepneyNumber}>
                            {transferRoute.routes[0].routeNo}
                          </Text>
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText}>
                            {transferRoute.routes[0].routeName}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.fareContainer}>
                        <View style={styles.fareDetailsRow}>
                          <View style={styles.fareDetail}>
                            <MaterialIcons
                              name="access-time"
                              size={16}
                              color="#666"
                            />
                            <Text style={styles.fareDetailText}>
                              {
                                transferRoute.segments.firstJeepney.duration
                                  .text
                              }
                            </Text>
                          </View>
                          <View style={styles.fareDetail}>
                            <MaterialIcons
                              name="straighten"
                              size={16}
                              color="#666"
                            />
                            <Text style={styles.fareDetailText}>
                              {
                                transferRoute.segments.firstJeepney.distance
                                  .text
                              }
                            </Text>
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
                              <MaterialCommunityIcons
                                name="jeepney"
                                size={20}
                                color="#666"
                              />
                              <Text style={styles.fareHeaderText}>
                                Traditional
                              </Text>
                            </View>

                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.firstJeepney
                                    .fare_estimation.traditional.regular
                                }
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="card-account-details"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.firstJeepney
                                    .fare_estimation.traditional.discounted
                                }
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
                                size={20}
                                color="#666"
                              />
                              <Text style={styles.fareHeaderText}>
                                Modernized
                              </Text>
                            </View>

                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.firstJeepney
                                    .fare_estimation.modernized.regular
                                }
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="card-account-details"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.firstJeepney
                                    .fare_estimation.modernized.discounted
                                }
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Step 3: Transfer Point */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(3, "transfer")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>3</Text>
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Get off</Text>
                      <View style={styles.instructionRow}>
                        <View style={styles.iconContainer}>
                          <MaterialIcons
                            name="transfer-within-a-station"
                            size={24}
                            color="#fff"
                          />
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText}>
                            {transferRoute.segments.transferWalk.address}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>
                          {transferRoute.segments.transferWalk.duration.text}
                        </Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.detailText}>
                          {transferRoute.segments.transferWalk.distance.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Step 4: Second Jeepney */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(4, "jeepney")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>4</Text>
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Ride Jeepney</Text>
                      <View style={styles.instructionRow}>
                        <View
                          style={[
                            styles.jeepneyBox,
                            {
                              backgroundColor:
                                transferRoute.routes[1].routeColor,
                            },
                          ]}
                        >
                          <FontAwesome5 name="bus" size={18} color="#fff" />
                          <Text style={styles.jeepneyNumber}>
                            {transferRoute.routes[1].routeNo}
                          </Text>
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText}>
                            {transferRoute.routes[1].routeName}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.fareContainer}>
                        <View style={styles.fareDetailsRow}>
                          <View style={styles.fareDetail}>
                            <MaterialIcons
                              name="access-time"
                              size={16}
                              color="#666"
                            />
                            <Text style={styles.fareDetailText}>
                              {
                                transferRoute.segments.secondJeepney.duration
                                  .text
                              }
                            </Text>
                          </View>
                          <View style={styles.fareDetail}>
                            <MaterialIcons
                              name="straighten"
                              size={16}
                              color="#666"
                            />
                            <Text style={styles.fareDetailText}>
                              {
                                transferRoute.segments.secondJeepney.distance
                                  .text
                              }
                            </Text>
                          </View>
                        </View>
                        <View style={styles.fareSection}>
                          <View style={styles.fareHeader}>
                            <View style={styles.fareTypeContainer}>
                              <MaterialCommunityIcons
                                name="jeepney"
                                size={20}
                                color="#666"
                              />
                              <Text style={styles.fareHeaderText}>
                                Traditional
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.secondJeepney
                                    .fare_estimation.traditional.regular
                                }
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="card-account-details"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.secondJeepney
                                    .fare_estimation.traditional.discounted
                                }
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.fareSection}>
                          <View style={styles.fareHeader}>
                            <View style={styles.fareTypeContainer}>
                              <MaterialIcons
                                name="directions-bus"
                                size={20}
                                color="#666"
                              />
                              <Text style={styles.fareHeaderText}>
                                Modernized
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.secondJeepney
                                    .fare_estimation.modernized.regular
                                }
                              </Text>
                            </View>
                            <View style={styles.fareDetail}>
                              <MaterialCommunityIcons
                                name="card-account-details"
                                size={16}
                                color="#666"
                              />
                              <Text style={styles.fareDetailText}>
                                ₱
                                {
                                  transferRoute.segments.secondJeepney
                                    .fare_estimation.modernized.discounted
                                }
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Step 5: Final Destination */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCardPress(5, "walk")}
                >
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineNumber}>
                        <Text style={styles.timelineNumberText}>5</Text>
                      </View>
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.instructionText}>Walk to</Text>
                      <View style={styles.instructionRow}>
                        <View style={styles.iconContainer}>
                          <MaterialIcons name="place" size={24} color="#fff" />
                        </View>
                        <View style={styles.instructionTextContainer}>
                          <Text style={styles.addressText}>
                            {transferRoute.segments.walkFromDropoff.address}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailsRow}>
                        <Text style={styles.detailText}>
                          {transferRoute.segments.walkFromDropoff.duration.text}
                        </Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.detailText}>
                          {transferRoute.segments.walkFromDropoff.distance.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <NavigationGuide
          directRoute={directRoute}
          transferRoute={transferRoute}
          onClose={handleCloseNavigation}
          mapRef={mapRef}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setNavigating={setNavigating}
        />
      )}
    </View>
  );
};

export default DisplayInstructions;
