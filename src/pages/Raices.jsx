import React, { useState } from 'react';
import { Target, Rocket, Satellite, ArrowRight, BookOpen, Zap } from 'lucide-react';
import Viga from '../components/Viga';
import Proyectil from '../components/Proyectil';
import Orbita from '../components/Orbita';

const Raices = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const problems = [
    {
      id: 'viga',
      icon: Target,
      title: 'Diseño de Viga Cúbica',
      description: 'Determina las dimensiones exactas de una viga de acero cúbica que debe tener un volumen específico para soportar cargas estructurales.',
      tags: ['Ingeniería Civil', 'Estructuras', 'Diseño'],
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      equation: 'f(x) = x³ - 750 = 0',
      applications: ['Construcción de edificios', 'Diseño estructural', 'Cálculo de materiales']
    },
    {
      id: 'proyectil',
      icon: Rocket,
      title: 'Trayectoria de Proyectil',
      description: 'Calcula la distancia horizontal exacta donde un proyectil alcanza una altura objetivo, aplicable en balística y deportes.',
      tags: ['Física', 'Balística', 'Deportes'],
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      equation: 'f(x) = 1.732x - 0.0218x² - 15 = 0',
      applications: ['Tiro deportivo', 'Balística militar', 'Lanzamiento de cohetes']
    },
    {
      id: 'orbita',
      icon: Satellite,
      title: 'Órbita Geoestacionaria',
      description: 'Encuentra el radio orbital exacto para que un satélite permanezca fijo sobre un punto de la Tierra (órbita geoestacionaria).',
      tags: ['Astrofísica', 'Satélites', 'GPS'],
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-50',
      equation: 'f(r) = √(3.986×10¹⁴/r) - 7.27×10⁻⁵r = 0',
      applications: ['Satélites GPS', 'Telecomunicaciones', 'TV satelital']
    }
  ];

  // NAVEGACIÓN A CADA PROBLEMA
  if (selectedProblem === 'viga') {
    return <Viga onBack={() => setSelectedProblem(null)} />;
  }

  if (selectedProblem === 'proyectil') {
    return <Proyectil onBack={() => setSelectedProblem(null)} />;
  }

  if (selectedProblem === 'orbita') {
    return <Orbita onBack={() => setSelectedProblem(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
          Raíces de Ecuaciones
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Métodos Numéricos Aplicados
        </p>
      </div>

      {/* Intro Info Card */}
      <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 mb-10 border border-rose-200">
        <p className="text-gray-700 leading-relaxed">
          Los métodos de <strong>Bisección</strong> y <strong>Newton-Raphson</strong> son técnicas fundamentales 
          para encontrar raíces de ecuaciones no lineales. Mientras que Bisección garantiza convergencia mediante 
          intervalos, Newton-Raphson ofrece convergencia más rápida usando derivadas.
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
          <Zap className="w-6 h-6 mr-3 text-rose-600" />
          Comparación de Métodos
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bisección */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Método de Bisección</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Robusto:</strong> Siempre converge si hay cambio de signo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Confiable:</strong> No requiere derivadas</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">⚠</span>
                <span><strong>Convergencia:</strong> Lineal (más lenta)</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-lg p-3 border border-amber-200">
              <code className="text-sm text-gray-800">
                m = (a + b) / 2<br/>
                Si f(a)·f(m) {'<'} 0 → b = m<br/>
                Sino → a = m
              </code>
            </div>
          </div>

          {/* Newton-Raphson */}
          <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-6 border border-rose-200">
            <h4 className="text-xl font-bold text-gray-800 mb-3">Método de Newton-Raphson</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Rápido:</strong> Convergencia cuadrática</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Preciso:</strong> Menos iteraciones</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-500 mr-2">⚠</span>
                <span><strong>Requisito:</strong> Necesita f'(x)</span>
              </li>
            </ul>
            <div className="mt-4 bg-white rounded-lg p-3 border border-rose-200">
              <code className="text-sm text-gray-800">
                x<sub>n+1</sub> = x<sub>n</sub> - f(x<sub>n</sub>)/f'(x<sub>n</sub>)
              </code>
            </div>
          </div>
        </div>

        {/* Cuándo usar cada método */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-lg font-bold text-gray-800 mb-3">💡 ¿Cuándo usar cada método?</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-amber-700 mb-2">Usar Bisección cuando:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• No conoces la derivada</li>
                <li>• Necesitas garantía de convergencia</li>
                <li>• Tienes un intervalo [a,b] claro</li>
                <li>• La función es complicada</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-rose-700 mb-2">Usar Newton-Raphson cuando:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Conoces la derivada f'(x)</li>
                <li>• Necesitas rapidez</li>
                <li>• Tienes buena aproximación inicial</li>
                <li>• La función es suave</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Raices;