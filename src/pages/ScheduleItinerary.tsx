import { useEffect, useState, type FC } from "react";
import { useScheduleItinerary } from "../contexts/ScheduleItineraryContext";
import OverlayReload from "../components/Loading";
import { useParams } from "react-router-dom";
import { handleGetTourItineraryByTour } from "../api/tourItinerary.api";
import type { TourItineraryType } from "../types/response/tour_itinerary.type";
import dayjs from "dayjs";
import { useSchedule } from "../contexts/ScheduleContext";
import { useUser } from "../contexts/UserContext";
import type {
  ScheduleItineraryCreateType,
  ScheduleItineraryUpdateType,
} from "../types/schemas/scheduleItinerary.schema";
import {
  handleCreateScheduleItinerary,
  handleUpdateScheduleItinerary,
} from "../api/scheduleItinerary.api";
import { toast } from "sonner";
import Modal from "../components/Modal";

const ScheduleItinerary: FC = () => {
  const { getScheduleItineraryBySchedule, scheduleItineraryList } =
    useScheduleItinerary();
  const { user } = useUser();
  const { getScheduleById } = useSchedule();
  const [selectedItinerary, setSelectedItinerary] =
    useState<TourItineraryType | null>(null);
  const [tourItineraryList, setTourItineraryList] = useState<
    TourItineraryType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  console.log(scheduleItineraryList);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      await getScheduleItineraryBySchedule(id!);
      const resSchedule = await getScheduleById(id!);
      const resTourItinerary = await handleGetTourItineraryByTour(
        resSchedule.tour.tourID
      );
      setTourItineraryList(resTourItinerary);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedItinerary) {
      toast.error("Lỗi xác nhận lịch trình");
      return;
    }
    const data: ScheduleItineraryCreateType = {
      itineraryID: selectedItinerary.itineraryID,
      scheduleID: id!,
      startTime: dayjs(),
    };
    const res = await handleCreateScheduleItinerary(data);
    if (res.scheduleItineraryId) {
      toast.success("Xác nhận đã đến!");
      fetchSchedules();
      setOpenCreateModal(false);
    } else {
      toast.error(res.message);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItinerary) {
      toast.error("Lỗi xác nhận lịch trình");
      return;
    }

    const current = scheduleItineraryList.find(
      (si) => si.tourItinerary?.itineraryID === selectedItinerary.itineraryID
    );

    if (!current) {
      toast.error("Không tìm thấy lịch trình hiện tại!");
      return;
    }

    const data: ScheduleItineraryUpdateType = {
      scheduleItineraryID: current.scheduleItineraryID,
      endTime: dayjs(),
    };

    const res = await handleUpdateScheduleItinerary(data);
    if (res.success) {
      toast.success("Xác nhận đã rời đi!");
      fetchSchedules();
      setOpenUpdateModal(false);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [id]);

  const getScheduleStatus = (tourItinerary: TourItineraryType) => {
    const scheduleItinerary = scheduleItineraryList.find(
      (si) => si.tourItinerary?.itineraryID === tourItinerary.itineraryID
    );

    if (!scheduleItinerary) {
      return { status: "not-arrived", scheduleItinerary: null };
    }

    if (scheduleItinerary.endTime) {
      return { status: "arrived", scheduleItinerary };
    }

    if (scheduleItinerary.startTime && !scheduleItinerary.endTime) {
      return { status: "current", scheduleItinerary };
    }

    return { status: "not-arrived", scheduleItinerary: null };
  };

  const getConsecutiveDaysForLocation = (currentIndex: number) => {
    const currentLocation = tourItineraryList[currentIndex].location;
    let count = 1;

    for (let i = currentIndex + 1; i < tourItineraryList.length; i++) {
      if (tourItineraryList[i].location === currentLocation) {
        count++;
      } else {
        break;
      }
    }

    return count;
  };

  if (loading || !scheduleItineraryList) {
    return <OverlayReload />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            {scheduleItineraryList.length > 0 && (
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {scheduleItineraryList[0].schedule.tour.tourName}
                </h1>
                <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                  {scheduleItineraryList[0].schedule.tour.description}
                </p>
                <div className="flex justify-center gap-8 text-sm text-gray-500 flex-wrap">
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="font-semibold">Ngày bắt đầu:</span>{" "}
                    {dayjs(scheduleItineraryList[0].schedule.startTime).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </div>
                  <div className="bg-green-50 px-3 py-1 rounded-full">
                    <span className="font-semibold">Ngày kết thúc:</span>{" "}
                    {dayjs(scheduleItineraryList[0].schedule.endTime).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </div>
                  <div className="bg-purple-50 px-3 py-1 rounded-full">
                    <span className="font-semibold">Số người:</span>{" "}
                    {scheduleItineraryList[0].schedule.numberPeople}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Lịch trình Tour
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Đã tới</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Địa điểm hiện tại</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Chưa tới</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {tourItineraryList.map((tourItinerary, index) => {
                const { status, scheduleItinerary } =
                  getScheduleStatus(tourItinerary);
                const consecutiveDays = getConsecutiveDaysForLocation(index);
                const isFirstDayOfLocation =
                  index === 0 ||
                  tourItineraryList[index - 1].location !==
                    tourItinerary.location;

                const getStatusConfig = () => {
                  switch (status) {
                    case "arrived":
                      return {
                        bgColor: "bg-green-50",
                        borderColor: "border-l-4 border-green-500",
                        circleColor: "bg-green-500 text-white",
                        badgeColor: "bg-green-100 text-green-800",
                        badgeText: "Đã tới",
                      };
                    case "current":
                      return {
                        bgColor: "bg-yellow-50",
                        borderColor: "border-l-4 border-yellow-500",
                        circleColor: "bg-yellow-500 text-white",
                        badgeColor: "bg-yellow-100 text-yellow-800",
                        badgeText: "Địa điểm hiện tại",
                        buttonColor:
                          "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                        buttonText: "Xác nhận rời đi",
                        function: () => setOpenUpdateModal(true),
                      };
                    default:
                      return {
                        bgColor: "bg-white",
                        borderColor: "border-l-4 border-gray-300",
                        circleColor: "bg-gray-300 text-gray-700",
                        badgeColor: "bg-gray-100 text-gray-800",
                        badgeText: "Chưa tới",
                        buttonColor:
                          "bg-blue-100 text-blue-700 hover:bg-blue-200",
                        buttonText: "Xác nhận đã tới",
                        function: () => setOpenCreateModal(true),
                      };
                  }
                };

                const config = getStatusConfig();

                return (
                  <div
                    key={tourItinerary.itineraryID}
                    className={`p-6 transition-all duration-200 border-b border-gray-100 last:border-b-0 ${config.bgColor} ${config.borderColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold ${config.circleColor}`}
                        >
                          {tourItinerary.dayNumber}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                status === "arrived"
                                  ? "text-green-800"
                                  : status === "current"
                                  ? "text-yellow-800"
                                  : "text-gray-700"
                              }`}
                            >
                              {tourItinerary.location}
                            </h3>

                            {isFirstDayOfLocation && consecutiveDays > 1 && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                {consecutiveDays} ngày
                              </span>
                            )}

                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${config.badgeColor}`}
                            >
                              {config.badgeText}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-3">
                            {tourItinerary.description}
                          </p>

                          {scheduleItinerary && (
                            <div className="bg-white rounded-lg p-4 border w-fit border-green-200">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">
                                    Đã tới lúc:
                                  </span>
                                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                                    {dayjs(scheduleItinerary.startTime).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </span>
                                </div>
                                {scheduleItinerary.endTime && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-700">
                                      Rời đi lúc:
                                    </span>
                                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                      {dayjs(scheduleItinerary.endTime).format(
                                        "DD/MM/YYYY HH:mm"
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {user?.role === "TourGuide" &&
                        (() => {
                          const prevItinerary = tourItineraryList[index - 1];
                          const prevStatus = prevItinerary
                            ? getScheduleStatus(prevItinerary).status
                            : "arrived";

                          const canShowButton = !(
                            status === "not-arrived" && prevStatus !== "arrived"
                          );

                          return (
                            canShowButton && (
                              <button
                                onClick={() => {
                                  setSelectedItinerary(tourItinerary);
                                  config.function?.();
                                }}
                                className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${config.buttonColor}`}
                              >
                                {config.buttonText}
                              </button>
                            )
                          );
                        })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {tourItineraryList.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {tourItineraryList.length}
                  </div>
                  <div className="text-sm text-gray-600">Tổng số ngày</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      tourItineraryList.filter(
                        (ti) => getScheduleStatus(ti).status === "arrived"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Đã tới</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      tourItineraryList.filter(
                        (ti) => getScheduleStatus(ti).status === "current"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Địa điểm hiện tại</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {
                      tourItineraryList.filter(
                        (ti) => getScheduleStatus(ti).status === "not-arrived"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Chưa tới</div>
                </div>
              </div>
            </div>
          )}

          {tourItineraryList.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🗓️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có lịch trình nào
              </h3>
              <p className="text-gray-500">Chưa có lịch trình cho tour này.</p>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title={"Thông báo"}
        description={`Xác nhận đã tới điểm dừng ${selectedItinerary?.location}?`}
        onAgree={() => handleCreate()}
      />

      <Modal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        title={"Thông báo"}
        description={`Xác nhận đã hoàn thành tại điểm dừng ${selectedItinerary?.location}?`}
        onAgree={() => handleUpdate()}
      />
    </>
  );
};

export default ScheduleItinerary;
