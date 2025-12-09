import React, { useState } from 'react';
import { Thermometer, Activity, TrendingUp, ArrowRight, BookOpen, Zap } from 'lucide-react';
import Enfriamiento from '../components/Enfriamiento';
import Epidemia from '../components/Epidemia';
import Finanzas from '../components/Finanzas';
const EcuacionesDiferenciales = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const problems = [
    {
      id: 'enfriamiento',
      icon: Thermometer,
      title: 'Ley de Enfriamiento de Newton',
      description: 'Modela el enfriamiento de objetos como tazas de café, sopas calientes o en investigaciones forenses para determinar tiempo de muerte.',
      tags: ['Física', 'Forense', 'Cotidiano'],
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      equation: 'dT/dt = -k(T - T_ambiente)',
      applications: ['Investigación forense', 'Industria alimentaria', 'Climatización']
    },
    {
      id: 'epidemia',
      icon: Activity,
      title: 'Modelo SIR - Epidemias',
      description: 'Simula la propagación de enfermedades infecciosas en poblaciones. Aplicado a COVID-19, gripe y otras epidemias.',
      tags: ['Epidemiología', 'Salud', 'Actual'],
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50',
      equation: 'dS/dt = -βSI, dI/dt = βSI - γI, dR/dt = γI',
      applications: ['Pandemias', 'Políticas de salud', 'Vacunación']
    },
{
  id: 'finanzas',
  icon: TrendingUp,
  title: 'Crecimiento de Inversiones',
  description: 'Calcula el crecimiento de inversiones con interés continuo y depósitos periódicos. Ideal para planificación financiera.',
  tags: ['Finanzas', 'Ahorro', 'Inversión'],
  gradient: 'from-sky-400 to-cyan-500',   // gradiente celeste
  bgGradient: 'from-sky-50 to-cyan-50',   // fondo celeste muy claro
  equation: 'dC/dt = rC + D',
  applications: ['Planificación de retiro', 'Fondos de inversión', 'Ahorro programado']
}

  ];

  // AQUÍ ES DONDE SE MANEJA LA NAVEGACIÓN A CADA PROBLEMA
  if (selectedProblem === 'enfriamiento') {
    return <Enfriamiento onBack={() => setSelectedProblem(null)} />;
  }

  if (selectedProblem === 'epidemia') {
    return <Epidemia onBack={() => setSelectedProblem(null)} />;
  }

  if (selectedProblem === 'finanzas') {
    return <Finanzas onBack={() => setSelectedProblem(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-lg">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Ecuaciones Diferenciales Ordinarias
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Aplicados a Problemas Reales
        </p>
        {/*<div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full mt-4">
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="text-purple-700 font-semibold">Métodos: Euler & Heun</span>
        </div>*/}
      </div>

      {/* Intro Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-10 border border-blue-200">
        
        <p className="text-gray-700 leading-relaxed">
          Los métodos de <strong>Euler</strong> y <strong>Heun</strong> son técnicas numéricas fundamentales 
          para resolver ecuaciones diferenciales ordinarias (EDOs). Mientras que Euler proporciona una 
          aproximación simple y directa, Heun mejora la precisión utilizando un enfoque predictor-corrector.
        </p>
        
      </div>

      {/* Problems Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {problems.map((problem) => {
          const Icon = problem.icon;
          return (
            <div
              key={problem.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-gray-200"
              onClick={() => setSelectedProblem(problem.id)}
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${problem.bgGradient} p-6 border-b-4 border-opacity-20`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${problem.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {problem.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                  {problem.description}
                </p>

                {/* Equation */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1 font-semibold">ECUACIÓN:</p>
                  <code className="text-sm text-gray-800 font-mono">{problem.equation}</code>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {problem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`bg-gradient-to-r ${problem.bgGradient} px-3 py-1 rounded-full text-sm font-semibold text-gray-700 border border-gray-200`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Applications */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-semibold mb-2">APLICACIONES:</p>
                  <ul className="space-y-1">
                    {problem.applications.map((app, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${problem.gradient} mr-2`}></span>
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button
                  className={`w-full bg-gradient-to-r ${problem.gradient} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group`}
                >
                  <span>Explorar Problema</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Methods Comparison Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-purple-600" />
          Comparación de Métodos
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Euler */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Método de Euler</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Simple:</strong> Fácil de implementar y entender</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Rápido:</strong> Computacionalmente eficiente</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠</span>
                <span><strong>Precisión:</strong> Error O(h²) por paso</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-lg p-3 border border-orange-200">
              <code className="text-sm text-gray-800">y(n+1) = y(n) + h·f(t(n), y(n))</code>
            </div>
          </div>

          {/* Heun */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Método de Heun</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Más preciso:</strong> Predictor-corrector</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Mejor error:</strong> O(h³) por paso</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">ℹ</span>
                <span><strong>Costo:</strong> Requiere 2 evaluaciones</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-lg p-3 border border-blue-200">
              <code className="text-xs text-gray-800">
                k1 = f(t(n), y(n))<br/>
                k2 = f(t(n)+h, y(n)+h·k1)<br/>
                y(n+1) = y(n) + (h/2)(k1+k2)
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info /}
      <div className="mt-10 text-center">
        <div className="inline-block bg-gray-800 text-white rounded-2xl px-8 py-6 shadow-xl">
          <p className="font-bold text-lg mb-2">📊 Proyecto Final - Análisis Numérico</p>
          <p className="text-gray-300 text-sm">
            Implementación práctica de métodos numéricos para EDOs
          </p>
        </div>
      </div>*/}
    </div>
  );
};

export default EcuacionesDiferenciales;