import axios from "axios";

export const getCoordinates = async (address: string) => {
  const res = await axios.get(
    `https://geocode.maps.co/search?q=${encodeURIComponent(
      address
    )}&api_key=68c3d40a45103634934146rvk8629f7`
  );

  if (res.data.length === 0) {
    return null;
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lon: parseFloat(res.data[0].lon),
  };
};
