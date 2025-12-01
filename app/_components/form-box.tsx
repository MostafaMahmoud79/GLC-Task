import LoginForm from "./login-form";

export default function FormBox() {
  return (
    <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4">
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10 text-[#9414FF]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
              />
            </svg>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold capitalize mb-2 text-gray-800">
            Welcome Back
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-[#62626B] leading-relaxed max-w-md mx-auto px-4">
            Step into our HR management system for an efficient workforce experience
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <span className="text-xs sm:text-sm text-[#62626B]">
            Need help? Contact{" "}
            <a href="mailto:support@example.com" className="text-[#9414FF] hover:underline font-medium">
              support@example.com
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}