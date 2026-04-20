import { StyleSheet, Text, View } from "react-native";
import { useEffect, useCallback } from "react";
import { Marker } from "react-native-maps";
import axios from "axios";
import { ShowStopsProps } from "@/types";
import icon from "@/assets/stop-marker2.png";
import React from "react";

const ShowStops = ({ stops, setStops }: ShowStopsProps) => {
  const getStops = useCallback(async () => {
    try {
      const response = await axios.get("/stop");

      setStops(response.data);
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  }, [stops]);

  useEffect(() => {
    getStops();
  }, []);

  return (
    <>
      {stops &&
        stops.map((item) => (
          <Marker
            key={item._id}
            coordinate={{
              latitude: item.location.lat,
              longitude: item.location.lng,
            }}
            icon={icon}
          />
        ))}
    </>
  );
};

export default ShowStops;

const styles = StyleSheet.create({});
