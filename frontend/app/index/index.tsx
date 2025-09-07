import React from 'react';
import type Index from '../routes';

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-900 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 border-2 border-gray-900"></div>
            <h1 className="text-2xl font-bold text-gray-900">TRACKING SYSTEM</h1>
          </div>
          
          <div className="flex space-x-4">
            <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-white border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 transition-colors">
              LOGIN
            </button>
            <button 
            onClick={() => window.location.href = '/register'}
            className="px-6 py-2 bg-gray-900 border-2 border-gray-900 text-white font-semibold hover:bg-gray-700 transition-colors">
              REGISTER
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                TRACK.<br />
                MONITOR.<br />
                CONTROL.
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Complete tracking solution for your business operations. 
                Monitor assets, manage inventory, and streamline workflows 
                with our comprehensive system.
              </p>
            </div>
            
            <div className="flex space-x-4 mb-8">
              <button className="px-8 py-3 bg-gray-900 border-2 border-gray-900 text-white font-semibold text-lg hover:bg-gray-700 transition-colors">
                GET STARTED
              </button>
              <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-colors">
                LEARN MORE
              </button>
            </div>

            {/* Feature boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-gray-300 p-4">
                <div className="w-6 h-6 bg-gray-900 mb-2"></div>
                <h4 className="font-semibold text-gray-900">REAL-TIME</h4>
                <p className="text-sm text-gray-600">Live tracking updates</p>
              </div>
              <div className="border-2 border-gray-300 p-4">
                <div className="w-6 h-6 bg-gray-900 mb-2"></div>
                <h4 className="font-semibold text-gray-900">SECURE</h4>
                <p className="text-sm text-gray-600">End-to-end encryption</p>
              </div>
            </div>
          </div>

          {/* Wireframe Dashboard Preview */}
          <div className="bg-white border-2 border-gray-900 p-6">
            <div className="border-b-2 border-gray-300 pb-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-gray-300"></div>
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-gray-300"></div>
                  <div className="w-4 h-4 bg-gray-300"></div>
                  <div className="w-4 h-4 bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-300 p-3">
                  <div className="w-full h-3 bg-gray-300 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-900"></div>
                </div>
                <div className="border border-gray-300 p-3">
                  <div className="w-full h-3 bg-gray-300 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-900"></div>
                </div>
                <div className="border border-gray-300 p-3">
                  <div className="w-full h-3 bg-gray-300 mb-2"></div>
                  <div className="w-16 h-6 bg-gray-900"></div>
                </div>
              </div>

              {/* Chart wireframe */}
              <div className="border border-gray-300 p-4">
                <div className="w-20 h-3 bg-gray-300 mb-4"></div>
                <div className="h-32 border border-gray-200 relative">
                  <div className="absolute bottom-0 left-4 w-8 h-16 bg-gray-300"></div>
                  <div className="absolute bottom-0 left-16 w-8 h-20 bg-gray-300"></div>
                  <div className="absolute bottom-0 left-28 w-8 h-12 bg-gray-300"></div>
                  <div className="absolute bottom-0 left-40 w-8 h-24 bg-gray-300"></div>
                </div>
              </div>

              {/* Table wireframe */}
              <div className="border border-gray-300">
                <div className="grid grid-cols-3 gap-4 p-3 border-b border-gray-200 bg-gray-100">
                  <div className="w-full h-3 bg-gray-400"></div>
                  <div className="w-full h-3 bg-gray-400"></div>
                  <div className="w-full h-3 bg-gray-400"></div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 p-3 border-b border-gray-200">
                    <div className="w-full h-3 bg-gray-300"></div>
                    <div className="w-full h-3 bg-gray-300"></div>
                    <div className="w-full h-3 bg-gray-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t-2 border-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">KEY FEATURES</h3>
            <div className="w-20 h-1 bg-gray-900 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'ASSET TRACKING', desc: 'Monitor all your assets in real-time with GPS and RFID integration' },
              { title: 'INVENTORY MGMT', desc: 'Complete inventory control with automated stock alerts and reporting' },
              { title: 'ANALYTICS', desc: 'Powerful dashboard with insights and performance metrics' }
            ].map((feature, index) => (
              <div key={index} className="border-2 border-gray-300 p-6 hover:border-gray-900 transition-colors">
                <div className="w-12 h-12 bg-gray-900 mb-4"></div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                <div className="mt-4">
                  <button className="text-gray-900 font-semibold hover:underline">
                    LEARN MORE →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-white"></div>
                <span className="font-bold">TRACKING SYSTEM</span>
              </div>
              <div className="space-y-2">
                <div className="w-32 h-3 bg-gray-700"></div>
                <div className="w-28 h-3 bg-gray-700"></div>
                <div className="w-36 h-3 bg-gray-700"></div>
              </div>
            </div>

            {['PRODUCT', 'COMPANY', 'SUPPORT'].map((section, index) => (
              <div key={index}>
                <h5 className="font-bold mb-4">{section}</h5>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-20 h-3 bg-gray-700"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <div className="w-48 h-3 bg-gray-700 mx-auto"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;