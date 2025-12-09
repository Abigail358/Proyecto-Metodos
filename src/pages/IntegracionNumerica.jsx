import React, { useState } from 'react';
import { Pill, Radio, Users, ArrowRight, BookOpen, Calculator } from 'lucide-react';
import Farmaco from '../components/Farmaco';
import Señal from '../components/Señal';
import Poblacion from '../components/Poblacion';

const IntegracionNumerica = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const problems = [
    {
      id: 'farmaco',
      icon: Pill,
      title: 'Concentración de Fármaco en Sangre',
      description: 'Calcula el área bajo la curva (AUC) de concentración del fármaco en el tiempo, métrica fundamental en farmacocinética para determinar dosis efectivas.',
      tags: ['Farmacología', 'Medicina', 'Bioquímica'],
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50',
      equation: '∫₀¹⁰ 10t·e^(-0.5t) dt',
      applications: ['Dosificación de medicamentos', 'Estudios clínicos', 'Farmacocinética']
    },
    {
      id: 'señal',
      icon: Radio,
      title: 'Señal de Radio Acumulada',
      description: 'Determina la energía total transmitida por una señal periódica integrando la amplitud a lo largo de un período completo de oscilación.',
      tags: ['Telecomunicaciones', 'Física', 'Señales'],
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50',
      equation: '∫₀¹ (5cos(2πt) + 3) dt',
      applications: ['Análisis de señales', 'Transmisión de datos', 'Radio frecuencia']
    },
    {
      id: 'poblacion',
      icon: Users,
      title: 'Población Creciente Acumulada',
      description: 'Calcula la población total acumulada a lo largo del tiempo considerando un crecimiento cuadrático, útil para planificación urbana y recursos.',
      tags: ['Demografía', 'Planificación', 'Estadística'],
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50',
      equation: '∫₀¹⁰ 1000(1 + 0.1t)² dt',
      applications: ['Planificación urbana', 'Recursos públicos', 'Censos poblacionales']
    }
  ];

  // NAVEGACIÓN A CADA PROBLEMA
  if (selectedProblem === 'farmaco') {
    return <Farmaco onBack={() => setSelectedProblem(null)} />;
  }

  if (selectedProblem === 'señal') {
    return <Señal onBack={() => setSelectedProblem(null)} />;
  }

  if (selectedProblem === 'poblacion') {
    return <Poblacion onBack={() => setSelectedProblem(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-cyan-600 bg-clip-text text-transparent">
          Integración Numérica
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Métodos de Aproximación de Integrales Definidas
        </p>
      </div>

      {/* Intro Info Card */}
      <div className="bg-gradient-to-r from-pink-50 to-cyan-50 rounded-2xl p-6 mb-10 border border-pink-200">
        <p className="text-gray-700 leading-relaxed">
          Los métodos de <strong>Trapecio</strong>, <strong>Simpson 1/3</strong> y <strong>Simpson 3/8</strong> son 
          técnicas numéricas para aproximar integrales definidas. Mientras que el Trapecio usa aproximación lineal, 
          los métodos de Simpson emplean parábolas de segundo y tercer grado para mayor precisión.
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
                  <p className="text-xs text-gray-500 mb-1 font-semibold">INTEGRAL:</p>
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
          <Calculator className="w-6 h-6 mr-3 text-pink-600" />
          Comparación de Métodos
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Trapecio */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Regla del Trapecio</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Simple:</strong> Aproximación lineal</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Rápido:</strong> Fácil de calcular</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠</span>
                <span><strong>Precisión:</strong> Menor exactitud</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-lg p-3 border border-emerald-200">
              <code className="text-xs text-gray-800">
                ∫f(x)dx ≈ (h/2)[y₀ + yₙ + 2Σyᵢ]
              </code>
            </div>
          </div>

          {/* Simpson 1/3 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Simpson 1/3</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Preciso:</strong> Parábola 2° grado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Balanced:</strong> Buena relación costo/precisión</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">!</span>
                <span><strong>Requisito:</strong> n debe ser par</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-lg p-3 border border-yellow-200">
              <code className="text-xs text-gray-800">
                ∫f(x)dx ≈ (h/3)[y₀ + yₙ + 4Σimpares + 2Σpares]
              </code>
            </div>
          </div>

          {/* Simpson 3/8 */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Simpson 3/8</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Más preciso:</strong> Parábola 3° grado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Flexible:</strong> Mejor para curvas complejas</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-600 mr-2">!</span>
                <span><strong>Requisito:</strong> n múltiplo de 3</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-lg p-3 border border-cyan-200">
              <code className="text-xs text-gray-800">
                ∫f(x)dx ≈ (3h/8)[y₀ + yₙ + 3Σ + 2Σ]
              </code>
            </div>
          </div>
        </div>

        {/* Cuándo usar cada método */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h4 className="text-lg font-bold text-gray-800 mb-3">💡 ¿Cuándo usar cada método?</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-emerald-700 mb-2">Usar Trapecio cuando:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Necesitas rapidez</li>
                <li>• Función aproximadamente lineal</li>
                <li>• Muchos subintervalos</li>
                <li>• Primera aproximación</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-yellow-700 mb-2">Usar Simpson 1/3 cuando:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Buscas buen balance</li>
                <li>• Funciones suaves</li>
                <li>• Tienes n par</li>
                <li>• Mayor precisión que Trapecio</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-cyan-700 mb-2">Usar Simpson 3/8 cuando:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Máxima precisión requerida</li>
                <li>• Curvas complejas</li>
                <li>• Tienes n múltiplo de 3</li>
                <li>• Funciones de alto orden</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nota sobre exactitud */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-bold text-gray-800 mb-3">📊 Orden de Precisión</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-center">
              <span className="font-semibold text-emerald-700 w-32">Trapecio:</span>
              <span>Error = O(h²) - Exacto para polinomios de grado 1</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold text-yellow-700 w-32">Simpson 1/3:</span>
              <span>Error = O(h⁴) - Exacto para polinomios de grado 3</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold text-cyan-700 w-32">Simpson 3/8:</span>
              <span>Error = O(h⁴) - Exacto para polinomios de grado 3</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegracionNumerica;