import React from "react";
import { AlertCircle } from "lucide-react";

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-center text-sm text-red-600">
      <AlertCircle className="h-5 w-5 mr-2" />
      {message}
    </div>
  );
}

export default ErrorMessage;
