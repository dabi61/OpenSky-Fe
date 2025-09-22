export type TourItineraryType = {
  itineraryID: string;
  tourID: string;
  dayNumber: number;
  location: string;
  description: string;
  isDeleted: boolean;
};

export type TourItineraryResponse = {
  message: string;
  itineraryId: string | null;
};
