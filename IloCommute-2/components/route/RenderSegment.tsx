import { LatLng, Polyline, Marker } from "react-native-maps";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { decode } from "@googlemaps/polyline-codec";
import React from "react";

interface RenderSegmentProps {
  polyline: string;
  color: string;
  isWalking: boolean;
  origin: LatLng;
  destination: LatLng;
  isStart?: boolean;
  isEnd?: boolean;
  routeColor?: string;
  secondaryRouteColor?: string;
  isFirstJeepney?: boolean;
  opacity?: number;
  zIndex?: number;
}

const RenderSegment = ({
  polyline,
  color,
  isWalking,
  origin,
  destination,
  isStart,
  isEnd,
  routeColor,
  secondaryRouteColor,
  isFirstJeepney,
  opacity = 1,
  zIndex = 1,
}: RenderSegmentProps) => {
  const points = decode(polyline, 5).map(([latitude, longitude]) => ({
    latitude,
    longitude,
  }));

  const getJeepneyColor = () => {
    if (!secondaryRouteColor) return routeColor;
    return isFirstJeepney ? routeColor : secondaryRouteColor;
  };

  return (
    <>
      <Polyline
        coordinates={points}
        strokeWidth={4}
        strokeColor={color}
        lineDashPattern={isWalking ? [1, 3] : undefined}
        style={{ opacity, zIndex }}
      />

      <Marker coordinate={origin}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 5,
            borderWidth: 1,
            borderColor: "#ddd",
            opacity,
            zIndex,
          }}
        >
          {isStart ? (
            <MaterialIcons name="trip-origin" size={24} color="green" />
          ) : isWalking ? (
            <MaterialIcons name="directions-walk" size={20} color="#4A89F3" />
          ) : (
            <Ionicons name="bus" size={20} color={getJeepneyColor()} />
          )}
        </View>
      </Marker>

      <Marker coordinate={destination}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 5,
            borderWidth: 1,
            borderColor: "#ddd",
            opacity,
            zIndex,
          }}
        >
          {isEnd ? (
            <MaterialIcons name="place" size={24} color="red" />
          ) : isWalking ? (
            <MaterialIcons name="directions-walk" size={20} color="#4A89F3" />
          ) : (
            <Ionicons name="bus" size={20} color={getJeepneyColor()} />
          )}
        </View>
      </Marker>
    </>
  );
};

export default RenderSegment;
