import {useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-4 bg-gray-800">
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          &larr; Back
        </button>
      </div>

    </div>
  );
};

export default Header;
