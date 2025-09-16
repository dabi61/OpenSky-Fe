import axios from "axios";

export const getCoordinates = async (address: string) => {
  const res = await axios.get(
    `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${
      import.meta.env.VITE_SECRET_GEOCODE_API
    }`
  );

  if (res.data.length === 0) {
    return null;
  }

  return {
    latitude: parseFloat(res.data[0].lat),
    lontitude: parseFloat(res.data[0].lon),
  };
};
