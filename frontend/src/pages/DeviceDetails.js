import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deviceService } from "../services/deviceService";

const DeviceDetails = () => {
  const { deviceId } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const data = await deviceService.fetchDeviceDetails(deviceId);
        setDevice(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [deviceId]);

  // Loading
  if (loading) return <div>Loading...</div>;

  // Error
  if (error) return <div>Error: {error}</div>;

  // No data
  if (!device) return <div>Device not found</div>;

  return (
    <div>
      <h1>{device.name}</h1>
      <p>Status: {device.status}</p>
      {/* 기타 디바이스 정보 표시 */}
    </div>
  );
};
export default DeviceDetails;
