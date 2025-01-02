const StepCard = ({ number, title, description }) => (
  <div>
    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-blue-600 font-bold text-xl">{number}</span>
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepsGrid = () => (
  <div className="grid md:grid-cols-3 gap-8 text-center">
    <StepCard
      number="1"
      title="Sign Up"
      description="Start with a simple registration"
    />
    <StepCard
      number="2"
      title="Connect Camera"
      description="Allow webcam access and start streaming"
    />
    <StepCard
      number="3"
      title="Monitor"
      description="View live feed from any device"
    />
  </div>
);

export default StepsGrid;
