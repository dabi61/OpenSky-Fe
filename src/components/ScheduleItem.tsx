import dayjs, { Dayjs } from "dayjs";
import type { ScheduleType } from "../types/response/schedule.type";
import { ScheduleStatus } from "../constants/ScheduleStatus";
import { useLocation, useNavigate } from "react-router-dom";
import assets from "../assets";

const ScheduleItem = ({ schedule }: { schedule: ScheduleType }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const getStatusColor = (status: string) => {
    switch (status) {
      case ScheduleStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case ScheduleStatus.SUSPEND:
        return "bg-yellow-100 text-yellow-800";
      case ScheduleStatus.REMOVED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDisplayStatus = () => {
    const now = dayjs();
    const startTime = dayjs(schedule.startTime);
    const endTime = dayjs(schedule.endTime);

    if (now.valueOf() >= startTime.valueOf()) {
      return {
        displayStatus: "Start",
        statusColor: "bg-purple-100 text-purple-800",
      };
    } else if (now.valueOf() >= endTime.valueOf()) {
      return {
        displayStatus: "End",
        statusColor: "bg-blue-100 text-blue-800",
      };
    }

    return {
      displayStatus: schedule.status,
      statusColor: getStatusColor(schedule.status),
    };
  };

  const formatDate = (date: Dayjs | Date) => {
    if (typeof date === "string") return new Date(date).toLocaleDateString();
    return date.toString();
  };

  const { displayStatus, statusColor } = getDisplayStatus();
  return (
    <tr
      key={schedule.scheduleID}
      className="hover:bg-gray-50 transition-colors"
      onClick={() => navigate(`/schedule_itinerary/${schedule.scheduleID}`)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {schedule.tour.tourName}
            </div>
            <div className="text-sm text-gray-500">
              {schedule.tour.price.toLocaleString()} VND
            </div>
          </div>
        </div>
      </td>

      {!location.includes("my_schedules") && (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={schedule.user.avatarURL || assets.logo}
                alt={schedule.user.fullName}
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {schedule.user.fullName}
              </div>
              <div className="text-sm text-gray-500">
                {schedule.user.phoneNumber}
              </div>
            </div>
          </div>
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(schedule.startTime)}
        </div>
        <div className="text-sm text-gray-500">
          đến {formatDate(schedule.endTime)}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <span className="font-medium">
            {schedule.tour.maxPeople - schedule.numberPeople}
          </span>
          <span className="text-gray-500">/{schedule.tour.maxPeople}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}
        >
          {displayStatus}
        </span>
      </td>
    </tr>
  );
};
export default ScheduleItem;
