import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import {
  FaUser,
  FaUserFriends,
  FaRoute,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Filler } from "chart.js";
import { FeedbackModal } from "../components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { authData, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAnalytics = useCallback(async () => {
    try {
      const analytics = await axios.get("/admin/analytics");
      setData(analytics.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    getAnalytics();
  }, [loading, getAnalytics]);

  if (loading) {
    return <div className="grid place-content-center">Loading...</div>;
  }

  const dataCards = [
    {
      title: "Users",
      value: data?.users,
      icon: <FaUser className="text-green-500" />,
      description: "Total number of registered users in the system.",
    },
    {
      title: "Guests",
      value: data?.guests,
      icon: <FaUserFriends className="text-gray-500" />,
      description:
        "Guests who have accessed the application without signing up.",
    },
    {
      title: "Routes",
      value: data?.routes,
      icon: <FaRoute className="text-red-500" />,
      description: "Jeepney routes available in the system.",
    },
    {
      title: "Stops",
      value: data?.stops,
      icon: <FaMapMarkerAlt className="text-yellow-500" />,
      description: "Total number of stops across all routes.",
    },
    {
      title: "Average Rating",
      value: data?.feedbackStats?.averageRating ?? "N/A",
      icon: <FaStar className="text-yellow-400" />,
      description: "Average user satisfaction rating.",
    },
    {
      title: "Feedback",
      value: `${data?.feedbackStats?.total || 0} messages`,
      icon: <FaStar className="text-yellow-400" />,
      description: "Click to view feedback messages",
      onClick: () => setIsModalOpen(true),
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const feedbackChartData = {
    labels:
      data?.feedbackStats?.ratingTrend?.map((item) => formatDate(item.date)) ||
      [],
    datasets: [
      {
        label: "Average Rating",
        data:
          data?.feedbackStats?.ratingTrend?.map((item) => item.average) || [],
        borderColor: "#008000",
        backgroundColor: "#07e500",
        tension: 0.3,
        fill: true,
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Rating Trends Over Time",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.3,
      },
      point: {
        radius: 5,
        hoverRadius: 7,
      },
    },
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 pt-24">
      <h1 className="w-fit text-2xl sm:text-3xl font-bold text-left mb-4 sm:mb-6 bg-gradient-to-r from-green-700 to-green-300 bg-clip-text text-transparent">
        Welcome back,{" "}
        {authData?.role === "admin" ? authData?.user?.name ?? "Admin" : "User"}!
      </h1>

      <p className="text-left mb-8 text-gray-600 text-sm sm:text-base">
        Here's a quick overview of the current system analytics. You can view
        the number of users, guests, available routes, and stops in the system.
        Use this data to monitor system growth and performance.
      </p>

      {data ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Data Cards in 2 columns */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dataCards.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center 
                    ${item.onClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                  onClick={item.onClick}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Chart */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-[400px]">
                <Line options={chartOptions} data={feedbackChartData} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">No analytics available.</p>
      )}

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feedbackMessages={data?.feedbackStats?.messages || []}
      />
    </div>
  );
};

export default Dashboard;
