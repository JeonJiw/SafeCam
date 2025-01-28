// StopStreamingModal.js
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

const StopStreamingModal = ({ onClose, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    setLoading(true);
    try {
      const success = await onVerify(verificationCode);
      if (success) {
        onClose();
      } else {
        setError("Invalid verification code");
      }
    } catch (error) {
      console.error("Failed to process verification:", error);
      setError(error.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Stop Monitoring
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Enter the verification code sent to your email to stop monitoring.
          </p>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full p-2 border rounded"
            maxLength={6}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleVerification}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-300"
            >
              {loading ? "Verifying..." : "Stop Monitoring"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopStreamingModal;
