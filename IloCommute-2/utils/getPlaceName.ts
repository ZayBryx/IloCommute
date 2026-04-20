import axios from "axios";

export default async function getStreetAddress(
  latitude: number,
  longitude: number
) {
  try {
    // Use Nominatim API for geocoding
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
        },
      }
    );
    const data = response.data;

    // Check if the response contains an address
    if (!data || !data.address) {
      return "Unknown location";
    }

    const { house_number, road, city, town, village, neighbourhood, state } =
      data.address;

    // Combine street number and road for full street address
    const streetAddress = [house_number, road, neighbourhood, village, town]
      .filter(Boolean)
      .join(" ");

    // Return "Street Address, City/State" or fallback to parts that exist
    return (
      [streetAddress, city || state].filter(Boolean).join(", ") ||
      "Unknown location"
    );
  } catch (error) {
    console.error(error);
    return "Unknown location";
  }
}
