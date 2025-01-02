import { Shield, Video, Bell, Lock } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <Icon className="h-12 w-12 text-blue-600 mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeaturesGrid = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
    <FeatureCard
      icon={Video}
      title="Live Streaming"
      description="Access real-time video through your web browser"
    />
    <FeatureCard
      icon={Bell}
      title="Motion Detection"
      description="Receive instant alerts when movement is detected"
    />
    <FeatureCard
      icon={Lock}
      title="Secure Access"
      description="Access limited to authenticated users only"
    />
    <FeatureCard
      icon={Shield}
      title="Safe Storage"
      description="Securely store all detected event logs"
    />
  </div>
);

export default FeaturesGrid;
