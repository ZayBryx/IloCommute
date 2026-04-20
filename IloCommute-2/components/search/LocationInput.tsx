import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationInputProps, LocationFormData } from "@/types";
import PlacesInput from "./PlacesInput";
import { useForm, Controller } from "react-hook-form";
import { LatLng } from "react-native-maps";
import { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import React from "react";

const iloiloCityBounds = {
  ne: { lat: 10.807, lng: 122.628 },
  sw: { lat: 10.67, lng: 122.494 },
};

const isWithinIloiloCity = (lat: number, lng: number) => {
  return (
    lat >= iloiloCityBounds.sw.lat &&
    lat <= iloiloCityBounds.ne.lat &&
    lng >= iloiloCityBounds.sw.lng &&
    lng <= iloiloCityBounds.ne.lng
  );
};

const LocationInput = ({
  origin,
  destination,
  setOrigin,
  setDestination,
  setIsPlacingMarker,
  bottomSheetRef,
  setSelectedInputType,
  originInputRef,
  destinationInputRef,
  setRoutesResponse,
  setDirectRoute,
  setTransferRoute,
}: LocationInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, watch, setValue } = useForm<LocationFormData>({
    defaultValues: {
      origin: origin,
      destination: destination,
    },
  });

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const watchOrigin = watch("origin");
  const watchDestination = watch("destination");

  useEffect(() => {
    if (origin) {
      setValue("origin", origin);
    }
    if (destination) {
      setValue("destination", destination);
    }
  }, [origin, destination, setValue]);

  const onSubmit = async (data: LocationFormData) => {
    if (
      data.origin &&
      data.destination &&
      data.origin.latitude === data.destination.latitude &&
      data.origin.longitude === data.destination.longitude
    ) {
      Alert.alert(
        "Origin and destination cannot be the same. Please select different locations."
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/routes/find", data, {
        timeout: 10000,
      });
      setRoutesResponse(response.data);
      bottomSheetRef.current?.snapToIndex(3);
    } catch (error) {
      console.error("Error finding routes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetOrigin = useCallback(
    (value: LatLng | null) => {
      if (value && !isWithinIloiloCity(value.latitude, value.longitude)) return;
      setValue("origin", value);
      setOrigin(value);
    },
    [setValue, setOrigin]
  );

  const handleSetDestination = useCallback(
    (value: LatLng | null) => {
      if (value && !isWithinIloiloCity(value.latitude, value.longitude)) {
        alert(
          "Selected location is outside Iloilo City. Please choose a location within Iloilo City."
        );
        return;
      }
      setValue("destination", value);
      setDestination(value);
    },
    [setValue, setDestination]
  );

  const styles = StyleSheet.create({
    genContainer: {
      flexDirection: "row",
      gap: 10,
    },
    container: {
      flex: 1,
      gap: 10,
    },
    findBtn: {
      flex: 0.2,
      height: 100,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      paddingVertical: 8,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.inactiveButton,
      opacity: 0.5,
    },
    buttonText: {
      color: theme.colors.buttonText,
      fontSize: 15,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.genContainer}>
      <View style={styles.container}>
        <Controller
          control={control}
          name="origin"
          render={({ field: { onChange } }) => (
            <PlacesInput
              setLocation={handleSetOrigin}
              bottomSheetRef={bottomSheetRef}
              inputType="origin"
              setIsPlacingMarker={setIsPlacingMarker}
              setSelectedInputType={setSelectedInputType}
              inputRef={originInputRef}
              setRoutesResponse={setRoutesResponse}
              setDirectRoute={setDirectRoute}
              setTransferRoute={setTransferRoute}
            />
          )}
        />

        <Controller
          control={control}
          name="destination"
          render={({ field: { onChange } }) => (
            <PlacesInput
              setLocation={handleSetDestination}
              bottomSheetRef={bottomSheetRef}
              inputType="destination"
              setIsPlacingMarker={setIsPlacingMarker}
              setSelectedInputType={setSelectedInputType}
              inputRef={destinationInputRef}
              setRoutesResponse={setRoutesResponse}
              setDirectRoute={setDirectRoute}
              setTransferRoute={setTransferRoute}
            />
          )}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.findBtn,
          !(watchOrigin && watchDestination) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!(watchOrigin && watchDestination) || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.buttonText} size="small" />
        ) : (
          <>
            <FontAwesome5
              name="map-marker-alt"
              size={18}
              color={theme.colors.buttonText}
            />
            <Text style={styles.buttonText}>Find</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LocationInput;
