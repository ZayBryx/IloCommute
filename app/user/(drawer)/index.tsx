import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { LatLng, PROVIDER_GOOGLE } from "react-native-maps";
import { useState } from "react";

const Index = () => {
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);

  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [showStops, setShowStops] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showSatellite, setShowSatellite] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 10.7202,
          longitude: 122.5621,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      ></MapView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
