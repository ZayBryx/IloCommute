import { useState } from "react";
import { useSetAtom } from "jotai";
import { showInboundAtom, showOutboundAtom } from "../atoms";
import {
  FaBus,
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const RouteControl = () => {
  const setShowInbound = useSetAtom(showInboundAtom);
  const setShowOutbound = useSetAtom(showOutboundAtom);
  const [allVisible, setAllVisible] = useState(true);

  const toggleAll = () => {
    setAllVisible((prev) => !prev);
    setShowInbound(!allVisible);
    setShowOutbound(!allVisible);
  };

  return (
    <div className="fixed h-12 sm:h-32 sm:right-4 sm:top-[0.75rem] bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 shadow-lg rounded-lg z-40 flex sm:flex-col flex-row items-center gap-2">
      {/* Outbound Toggle */}
      <div className="relative group">
        <button
          onClick={() => setShowOutbound((prev) => !prev)}
          className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex flex-col items-center justify-center shadow-md"
          title="Toggle Outbound Route"
        >
          <FaBus size={10} />
          <FaArrowRight size={10} />
        </button>
       
      </div>

      {/* Inbound Toggle */}
      <div className="relative group">
        <button
          onClick={() => setShowInbound((prev) => !prev)}
          className="w-8 h-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex flex-col items-center justify-center shadow-md"
          title="Toggle Inbound Route"
        >
          <FaBus size={10} />
          <FaArrowLeft size={10} />
        </button>
        
      </div>

      {/* Toggle All */}
      <div className="relative group">
        <button
          onClick={toggleAll}
          className={`w-8 h-8 ${
            allVisible
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white rounded-lg transition flex items-center justify-center shadow-md`}
          title={allVisible ? "Hide All Routes" : "Show All Routes"}
        >
          {allVisible ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
        </button>
        
      </div>
    </div>
  );
};

export default RouteControl;
