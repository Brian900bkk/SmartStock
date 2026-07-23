import businessBg from "../assets/images/business-bg.jpg";

function HeroBanner() {
  const hour = new Date().getHours();

  let greeting = "Welcome Back ";

  if (hour < 12) {
    greeting = "Good Morning ";
  } else if (hour < 18) {
    greeting = "Good Afternoon ";
  } else {
    greeting = "Good Evening ";
  }

  return (
    <div className="relative h-60 rounded-3xl overflow-hidden shadow-xl">
      <img
        src={businessBg}
        alt="Business"
        className="absolute inset-0 w-full h-full object-cover"
      />

      
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50"></div>

  
      <div className="relative z-10 h-full flex items-center px-10">
        <div className="text-white">
          <h1 className="text-4xl font-bold">
            {greeting}
          </h1>

          <p className="mt-3 text-lg text-gray-200">
            Monitor your inventory and business performance from one dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;