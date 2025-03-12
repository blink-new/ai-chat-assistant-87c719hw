import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-indigo-900 mb-4">
            AI Chat Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Experience intelligent conversations with our advanced AI assistant. Get answers, ideas, and help instantly.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Chatting Now
          </button>
          
          <div className="mt-12 bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto border border-gray-100">
            <div className="flex flex-col space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg self-start max-w-[80%]">
                <p className="text-gray-800">How can I help you today?</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg self-end max-w-[80%]">
                <p className="text-indigo-900">I need help with my project.</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg self-start max-w-[80%]">
                <p className="text-gray-800">I'd be happy to help with your project! What kind of project are you working on?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App