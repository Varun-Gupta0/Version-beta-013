// import Image from "next/image";
// import Link from "next/link";

// --- Features Array (moved outside component) ---
// By defining this here, it's created once, not on every render.
const features = [
  {
    title: "Secure Blockchain",
    description: "Your medical data is encrypted and stored securely on the blockchain",
    icon: "🔒"
  },
  {
    title: "AI-Powered Insights",
    description: "Get intelligent health insights and personalized recommendations",
    icon: "🤖"
  },
  {
    title: "Easy Access",
    description: "Access your medical records anytime, anywhere, securely",
    icon: "📱"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-medical-light dark:from-gray-900 dark:to-gray-800">
      
      {/* --- NEW Header --- */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Med<span className="text-medical-DEFAULT">Wallet</span>
          </h2>
          <nav>
            {/* When in your real project, change this back to: <Link href="/auth"> */}
            <a
              href="/auth"
              className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-medical-DEFAULT dark:border-medical-light text-sm font-medium rounded-lg text-medical-DEFAULT dark:text-medical-light bg-gray-100 dark:bg-gray-800 hover:bg-medical-light/10 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Login / Register
            </a>
            {/* </Link> */}
          </nav>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Secure Medical Data Management with{" "}
                  <span className="text-medical-DEFAULT">AI & Blockchain</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Experience the future of healthcare data management. Secure, accessible, and intelligent.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Replaced Next/Link with <a> for preview compatibility */}
                  {/* When in your real project, change this back to: <Link href="/auth"> */}
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-medical-DEFAULT dark:border-medical-light text-base font-medium rounded-lg text-medical-DEFAULT dark:text-medical-light bg-gray-100 dark:bg-gray-800 hover:bg-medical-light/10 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Get Started
                  </a>
                  {/* </Link> */}
                  {/* Removed the redundant "Login/Register" button, as it's now in the header */}
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4">
                    <div className="w-full h-full mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-medical-light via-medical-DEFAULT to-medical-dark" />
                  </div>
                  {/* Replaced Next/Image with <img> for preview compatibility */}
                  {/* When in your real project, change this back to: <Image ... /> and place your image in /public */}
                  <img
                    src="/medical-dashboard.jpg"
                    width={600}
                    height={400}
                    className="relative rounded-lg shadow-2xl"
                    alt="Medical Dashboard Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Why Choose MedWallet?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => ( // Now using the 'features' constant from outside
                <div key={feature.title} className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-medical-DEFAULT dark:text-medical-light mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- NEW Footer --- */}
      <footer className="py-10 bg-gray-100 dark:bg-gray-900/50 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} MedWallet. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            {/* When in your real project, change these back to: <Link href="..."> */}
            <a href="#" className="hover:text-medical-DEFAULT">Privacy Policy</a>
            <a href="#" className="hover:text-medical-DEFAULT">Terms of Service</a>
            <a href="#" className="hover:text-medical-DEFAULT">Contact Us</a>
            {/* </Link> */}
          </div>
        </div>
      </footer>
      
    </div>
  );
}

