import { SignIn } from "@clerk/nextjs";

// Dummy Bar Chart Component using SVG
const BarChartPlaceholder = () => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-56 w-full max-w-md">
    <h3 className="font-semibold mb-4 text-gray-700">Monthly Expenses</h3>
    <svg viewBox="0 0 100 50" className="w-full h-full text-indigo-500 fill-current">
      <rect x="10" y="20" width="12" height="30" rx="2" />
      <rect x="35" y="10" width="12" height="40" rx="2" className="text-indigo-400" />
      <rect x="60" y="25" width="12" height="25" rx="2" className="text-indigo-300" />
      <rect x="85" y="5" width="12" height="45" rx="2" className="text-indigo-600" />
    </svg>
  </div>
);

// Dummy Pie Chart Component using SVG
const PieChartPlaceholder = () => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-56 w-full max-w-md mt-6">
    <h3 className="font-semibold mb-4 text-gray-700">Expense Distribution</h3>
    <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90 rounded-full">
      <circle r="25" cx="50" cy="50" className="text-indigo-500" strokeWidth="50" stroke="currentColor" strokeDasharray="39.25 117.8" fill="none" />
      <circle r="25" cx="50" cy="50" className="text-purple-400" strokeWidth="50" stroke="currentColor" strokeDasharray="78.5 78.5" strokeDashoffset="-39.25" fill="none" />
      <circle r="25" cx="50" cy="50" className="text-blue-300" strokeWidth="50" stroke="currentColor" strokeDasharray="39.25 117.8" strokeDashoffset="-117.75" fill="none" />
    </svg>
  </div>
);

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-12 items-center justify-between">
        
        {/* Left Side: Clerk Sign In Component */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <SignIn />
        </div>

        {/* Right Side: Dummy Charts */}
        <div className="w-full lg:w-1/2 flex-col items-center justify-center hidden lg:flex lg:justify-start">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your financial dashboards.</p>
          </div>
          <BarChartPlaceholder />
          <PieChartPlaceholder />
        </div>

      </div>
    </div>
  );
}