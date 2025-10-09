import { FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const goToProfile = () => {
    navigate("/profile");
  };
  const goToEmployee = () => {
    navigate("/employees");
  };

  return (
    <header className="bg-gray-50 border-b rounded-b-sm border-gray-200 p-4 md:px-6 py-3 md:py-3 sticky top-0 z-20 mt-0">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="text-start max-[768px]:pl-10">
          <p>
            <span className="block font-medium text-gray-800">Welcome,</span>{" "}
            <span className="font-medium text-gray-800">
              {user?.full_name || user?.username || "Guest"}!
            </span>
          </p>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="flex items-center gap-3">
            {/* Profile icon/picture is now clickable */}
            {user?.profile_pic ? (
              <img
                src={user.profile_pic}
                alt="Profile"
                onClick={goToProfile}
                className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              />
            ) : (
              <div
                onClick={goToProfile}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              >
                <FaUser className="text-gray-500" />
              </div>
            )}

            {/* Notification */}
            
            <button className="relative p-2 rounded-full hover:bg-white" onClick={goToEmployee}>
              <FaBell className="text-yellow-400 text-lg" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
