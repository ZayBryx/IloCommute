import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY_3 } from "@env";
import formatLocation from "@/utils/formatLocation";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { PlacesInputProp } from "@/types";
import getPlaceName from "@/utils/getPlaceName";
import * as Location from "expo-location";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";
import React from "react";

const iloiloCityBounds = {
  ne: { lat: 10.807, lng: 122.628 },
  sw: { lat: 10.67, lng: 122.494 },
};

const PlacesInput = ({
  setLocation,
  bottomSheetRef,
  inputType,
  setIsPlacingMarker,
  setSelectedInputType,
  inputRef,
  setRoutesResponse,
  setDirectRoute,
  setTransferRoute,
}: PlacesInputProp) => {
  const [isFocus, setIsFocus] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const checkValue = () => {
      const currentText = inputRef.current?.getAddressText();
      setHasValue(!!currentText);
    };

    checkValue();

    const interval = setInterval(checkValue, 100);

    return () => clearInterval(interval);
  }, [inputRef]);

  const getCurrentLocation = useCallback(async () => {
    Keyboard.dismiss();
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    const location = await Location.getCurrentPositionAsync({});

    const placeName = await getPlaceName(
      location.coords.latitude,
      location.coords.longitude
    );

    const locationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setLocation(locationData);
    setHasValue(true);

    // don't remove this line!!! inorder to fix the setAddressText bug I need this line
    inputRef?.current?.setAddressText(placeName);
    inputRef?.current?.setAddressText(placeName);
  }, [setLocation]);

  const markerPlacing = useCallback(async () => {
    Keyboard.dismiss();
    setIsPlacingMarker(true);
    setSelectedInputType(inputType);
    bottomSheetRef.current?.snapToIndex(0);
  }, [setIsPlacingMarker, bottomSheetRef, inputType, setSelectedInputType]);

  const erase = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.clear();
      inputRef.current.setAddressText("");
    }

    setRoutesResponse(null);
    setDirectRoute(null);
    setTransferRoute(null);

    setLocation(null);
    setSelectedInputType(null);
    setIsFocus(false);
    setHasValue(false);
    Keyboard.dismiss();
  }, [setLocation, setSelectedInputType, setIsFocus, setRoutesResponse]);

  const isWithinIloiloCity = useCallback((lat: number, lng: number) => {
    return (
      lat >= iloiloCityBounds.sw.lat &&
      lat <= iloiloCityBounds.ne.lat &&
      lng >= iloiloCityBounds.sw.lng &&
      lng <= iloiloCityBounds.ne.lng
    );
  }, []);

  const styles = StyleSheet.create({
    container: {
      position: "relative",
    },
    input: {
      height: 45,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 16,
      backgroundColor: theme.colors.cardBackground,
      color: theme.colors.text,
    },
    iconContainer: {
      position: "absolute",
      width: 50,
      height: 50,
      top: 10,
      right: -20,
      zIndex: 10,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.inactiveButton,
    },
    btnContainer: {
      flexDirection: "row",
      gap: 10,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    buttonText: {
      color: theme.colors.buttonText,
      fontSize: 15,
      fontWeight: "600",
    },
    button: {
      flex: 1,
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
  });

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={inputRef as React.LegacyRef<GooglePlacesAutocompleteRef>}
        placeholder={`Search for a ${inputType}`}
        onPress={(data, details = null) => {
          if (!details?.geometry?.location) return;

          const { lat, lng } = details.geometry.location;

          if (!isWithinIloiloCity(lat, lng)) {
            if (inputRef.current) {
              inputRef.current.clear();
              inputRef.current.setAddressText("");
            }
            alert(
              "Selected location is outside Iloilo City. Please choose a location within Iloilo City."
            );
            setHasValue(false);
            Keyboard.dismiss();
            setIsFocus(false);
            return;
          }

          setLocation(formatLocation(details.geometry.location));
          setHasValue(true);
          Keyboard.dismiss();
          setIsFocus(false);
        }}
        fetchDetails={true}
        enableHighAccuracyLocation={true}
        keepResultsAfterBlur={true}
        enablePoweredByContainer={false}
        minLength={2}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
        onFail={(error) => console.error(error)}
        textInputProps={{
          placeholderTextColor: theme.colors.textSecondary,
          onFocus: () => {
            setIsFocus(true);
            bottomSheetRef.current?.snapToIndex(1);
          },
          onBlur: () => {
            setIsFocus(false);
            bottomSheetRef.current?.snapToIndex(0);
          },
          onChangeText: (text) => {
            setHasValue(!!text);
          },
        }}
        query={{
          key: GOOGLE_API_KEY_3,
          language: "en",
          components: "country:ph",
          location: "10.7202,122.5621",
          radius: "90000",
          strictbounds: true,
          types: ["geocode", "establishment"],
        }}
        styles={{
          container: { flex: 0 },
          textInput: styles.input,
          listView: {
            backgroundColor: theme.colors.background,
            borderRadius: 8,
            marginTop: 5,
            position: "absolute",
            display: isFocus ? "flex" : "none",
            top: 45,
            left: 0,
            right: 0,
            zIndex: 10,
          },
          row: {
            backgroundColor: theme.colors.background,
            padding: 13,
            minHeight: 44,
            flexDirection: "row",
          },
          separator: {
            height: 0.5,
            backgroundColor: theme.colors.border,
          },
          description: {
            color: theme.colors.text,
          },
          poweredContainer: {
            backgroundColor: theme.colors.background,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
          powered: {
            tintColor: theme.colors.textSecondary,
          },
        }}
      />

      {hasValue && (
        <TouchableWithoutFeedback onPress={erase}>
          <View style={[styles.iconContainer]}>
            <FontAwesome5
              name="times"
              size={24}
              color={theme.colors.textSecondary}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      {isFocus && (
        <>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => getCurrentLocation()}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons
                  name="my-location"
                  size={18}
                  color={theme.colors.buttonText}
                />
                <Text style={styles.buttonText}>Current Location</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => markerPlacing()}
            >
              <View style={styles.buttonContent}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={18}
                  color={theme.colors.buttonText}
                />
                <Text style={styles.buttonText}>Mark on Map</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default PlacesInput;
