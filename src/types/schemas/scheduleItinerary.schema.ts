import type { Dayjs } from "dayjs";
import type { ScheduleType } from "../response/schedule.type";
import type { TourItineraryType } from "../response/tour_itinerary.type";

export type ScheduleItineraryCreateType = {
  scheduleID: string;
  itineraryID: string;
  startTime: Dayjs;
};

export type ScheduleItineraryUpdateType = {
  scheduleItineraryID: string;
  endTime: Dayjs;
};

export type ScheduleItineraryType = {
  scheduleItineraryID: string;
  startTime: Dayjs;
  endTime: Dayjs;
  location: string;
  description: string;
  dayNumber: number;
  schedule: ScheduleType;
  tourItinerary: TourItineraryType;
};
