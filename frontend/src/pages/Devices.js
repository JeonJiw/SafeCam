import React, { useEffect, useState } from "react";
import { deviceService } from "../services/deviceService";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await deviceService.fetchAllDevices();
        setDevices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {devices.map((device) => (
        <div key={device.id}>
          {device.name}
          {/* 기타 디바이스 정보 표시 */}
        </div>
      ))}
    </div>
  );
};

export default Devices;
