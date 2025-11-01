import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-medical-light dark:from-gray-900 dark:to-gray-800">
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
              <div className="flex justify-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-medical-DEFAULT dark:border-medical-light text-base font-medium rounded-lg text-medical-DEFAULT dark:text-medical-light bg-gray-100 dark:bg-gray-800 hover:bg-medical-light/10 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Login/Register
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4">
                  <div className="w-full h-full mx-auto opacity-30 blur-lg filter bg-gradient-to-r from-medical-light via-medical-DEFAULT to-medical-dark" />
                </div>
                <Image
                  src="/medical-dashboard.jpg"
                  alt="Medical Dashboard Preview"
                  width={600}
                  height={400}
                  className="relative rounded-lg shadow-2xl"
                  priority
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
            {[
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
            ].map((feature) => (
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
    </div>
  );
}
