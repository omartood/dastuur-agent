"use client";

import { useState, useEffect } from "react";
import { Scale, Sparkles, Zap, Shield, MessageSquare, ArrowRight, BookOpen, Search, Brain, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <img src="/logo.png" alt="Dastuur Agent Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-blue-500/20" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Dastuur Agent
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/chat"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                Launch App
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div
              className={`text-center transform transition-all duration-1000 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 shadow-sm">
                <Sparkles size={16} className="animate-pulse" aria-hidden="true" />
                Powered by Google Gemini & Memvid AI
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-700">
                  Your AI-Powered
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  Constitutional Assistant
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed px-2">
                Waxaan ku caawinayaa inaad fahanto <span className="font-semibold text-blue-600">Dastuurka Jamhuuriyadda Federaalka Soomaaliya</span> adoo isticmaalaya teknoolajiyada AI-ga casriga ah.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4">
                <Link
                  href="/chat"
                  className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold text-lg shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  Bilow Hadda
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-slate-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  Baro Wax Badan
                  <ChevronDown size={20} aria-hidden="true" />
                </a>
              </div>

              {/* Hero Image/Visual */}
              <div className="relative max-w-5xl mx-auto mt-8 sm:mt-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full"></div>
                <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200/60 p-4 sm:p-8 transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-lg px-4 py-2 text-sm text-slate-500">
                      dastuur.omartood.com
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Sample Chat Message */}
                    <div className="flex gap-3 justify-end">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-md">
                        Qodobka 3aad maxuu ka hadlayaa?
                      </div>
                    </div>
                    <div className="flex gap-3 text-left">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={20} className="text-white" aria-hidden="true" />
                      </div>
                      <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl rounded-tl-sm max-w-2xl">
                        <p className="text-slate-700 leading-relaxed">
                          <strong>Qodobka 3aad</strong> wuxuu ka hadlayaa <strong>Madax-bannaanida iyo Midnimada Qaranka</strong>. Wuxuu sheegayaa in Jamhuuriyadda Federaalka Soomaaliya ay tahay dal madax-bannaan oo midaysan...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Sababta Aad U Dooranayso Dastuur Agent
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Teknoolajiyada AI-ga casriga ah oo ku salaysan RAG (Retrieval-Augmented Generation)
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-200/60 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                  <Brain size={28} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">AI Casri ah</h3>
                <p className="text-slate-600 leading-relaxed">
                  Waxaan isticmaalnaa Google Gemini & Memvid AI si aan kuugu bixinno jawaabo sax ah oo ku salaysan Dastuurka.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-200/60 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-pink-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                  <Search size={28} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Raadinta Xaqiiqda</h3>
                <p className="text-slate-600 leading-relaxed">
                  Raadi qodobada iyo cutubada Dastuurka si degdeg ah oo sax ah adoo isticmaalaya luuqadda dabiiciga ah.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-200/60 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
                  <MessageSquare size={28} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Sheekooyin Badan</h3>
                <p className="text-slate-600 leading-relaxed">
                  Samayso sheekooyin badan oo kala duwan, mid walba oo leh taariikhdiisa gaarka ah oo la keydiyo.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-200/60 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-orange-500 to-red-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
                  <Shield size={28} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Macluumaad Sax ah</h3>
                <p className="text-slate-600 leading-relaxed">
                  Dhammaan jawaabaha waxay ku salaysan yihiin Dastuurka rasmiga ah ee Soomaaliya.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-200/60 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                  <Zap size={28} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Degdeg ah</h3>
                <p className="text-slate-600 leading-relaxed">
                  Hel jawaabo degdeg ah oo sax ah ilaa dhawr ilbiriqsi gudahood.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-slate-200/60 transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-pink-500 to-rose-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-shadow">
                  <BookOpen size={28} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Fudud in la Isticmaalo</h3>
                <p className="text-slate-600 leading-relaxed">
                  Interface casri ah oo fudud oo qof walba uu isticmaali karo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Sidee Ayuu U Shaqeeyaa?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Habka fudud ee saddex tallaabo ah
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/60 h-full">
                  <div className="absolute -top-4 -left-4 bg-gradient-to-br from-blue-600 to-cyan-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">Weydii Su'aashaada</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Qor su'aashaada ku saabsan Dastuurka Soomaaliya adoo isticmaalaya luuqadda dabiiciga ah.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/60 h-full">
                  <div className="absolute -top-4 -left-4 bg-gradient-to-br from-purple-600 to-pink-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">AI Wuu Baarayaa</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Nidaamkeenu wuxuu raadiyaa qodobada iyo macluumaadka ku habboon Dastuurka.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/60 h-full">
                  <div className="absolute -top-4 -left-4 bg-gradient-to-br from-emerald-600 to-teal-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">Hel Jawaabta</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Hel jawaab sax ah oo faahfaahsan oo ku salaysan Dastuurka rasmiga ah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Diyaar ma u tahay inaad bilowdo?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Bilow maanta oo fahmo Dastuurka Soomaaliya si fudud oo casri ah
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-200"
            >
              Fur Barnaamijka Hadda
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="Dastuur Agent Logo" className="w-8 h-8 object-contain rounded-xl" />
            </div>
            <span className="text-2xl font-bold text-white">Dastuur Agent</span>
          </div>
          <p className="text-slate-400 mb-6">
            Kaaliyaha AI-ga ee Dastuurka Jamhuuriyadda Federaalka Soomaaliya
          </p>
          <p className="text-sm text-slate-500">
            © 2026 Dastuur Agent. Xuquuqda way dhawran yihiin.
          </p>
        </div>
      </footer>
    </div>
  );
}
