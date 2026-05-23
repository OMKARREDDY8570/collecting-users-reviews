export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Feedback & Review System
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Centralized platform for collecting, managing, and analyzing customer feedback
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <a
            href="/feedback?project=app-one"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Leave Feedback
          </a>
          <a
            href="/admin/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Admin Dashboard
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🔒 Secure</h3>
            <p className="text-sm text-gray-600">
              Multi-layer bot and spam protection
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">⚡ Fast</h3>
            <p className="text-sm text-gray-600">
              Optimized for Vercel's serverless
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">📊 Smart</h3>
            <p className="text-sm text-gray-600">
              Built-in analytics and filtering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
