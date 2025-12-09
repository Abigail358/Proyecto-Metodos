import React, { useState } from 'react';
import { ArrowLeft, Calculator, Satellite, BookOpen, Globe } from 'lucide-react';

const Orbita = ({ onBack }) => {
  // Estados para los inputs - Constantes físicas
  const [mu, setMu] = useState(3.986e14); // Parámetro gravitacional terrestre (m³/s²)
  const [T, setT] = useState(86400); // Período orbital (segundos) - 24 horas
  const [radioTierra, setRadioTierra] = useState(6371000); // Radio de la Tierra (m)
  
  // Para Bisección
  const [rMin, setRMin] = useState(30000000); // 30,000 km
  const [rMax, setRMax] = useState(50000000); // 50,000 km
  
  // Para Newton-Raphson
  const [r0Newton, setR0Newton] = useState(42000000); // ~42,000 km (cerca del valor real)
  
  const [tolerancia, setTolerancia] = useState(1);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('ambos');

  // Estados para resultados
  const [resultsBiseccion, setResultsBiseccion] = useState([]);
  const [resultsNewton, setResultsNewton] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Ecuación de órbita geoestacionaria:
  // v = √(μ/r) = 2πr/T
  // √(μ/r) = 2πr/T
  // √μ/√r = 2πr/T
  // T√μ = 2πr^(3/2)
  // T√μ/(2π) = r^(3/2)
  // 
  // Función f(r) = √(μ/r) - 2πr/T = 0
  // O reescribiendo: f(r) = √μ/√r - 2πr/T

  const f = (r) => {
    return Math.sqrt(mu / r) - (2 * Math.PI * r) / T;
  };

  // Derivada f'(r) = -√μ/(2r^(3/2)) - 2π/T
  const fPrima = (r) => {
    return -Math.sqrt(mu) / (2 * Math.pow(r, 3/2)) - (2 * Math.PI) / T;
  };

  // Solución exacta: r = (T√μ/(2π))^(2/3)
  const calcularRadioExacto = () => {
    const factor = (T * Math.sqrt(mu)) / (2 * Math.PI);
    return Math.pow(factor, 2/3);
  };

  // Método de Bisección
  const calculateBiseccion = () => {
    const results = [];
    let a = rMin;
    let b = rMax;
    let iteracion = 0;
    const maxIter = 100;

    // Verificar que hay cambio de signo
    if (f(a) * f(b) > 0) {
      alert('No hay cambio de signo en el intervalo [a, b]. Ajusta los límites.');
      return [];
    }

    while (iteracion < maxIter) {
      const m = (a + b) / 2;
      const fa = f(a);
      const fb = f(b);
      const fm = f(m);
      const tol = Math.abs(fm);

      results.push({
        iteracion: iteracion,
        a: a,
        b: b,
        m: m,
        fa: fa,
        fb: fb,
        fm: fm,
        tol: tol
      });

      if (tol <= tolerancia) {
        break;
      }

      // Actualizar intervalo
      if (fa * fm < 0) {
        b = m;
      } else {
        a = m;
      }

      iteracion++;
    }

    return results;
  };

  // Método de Newton-Raphson
  const calculateNewton = () => {
    const results = [];
    let r = r0Newton;
    let iteracion = 0;
    const maxIter = 100;

    while (iteracion < maxIter) {
      const fr = f(r);
      const fpr = fPrima(r);
      const tol = Math.abs(fr);

      results.push({
        iteracion: iteracion,
        x: r,
        fx: fr,
        fpx: fpr,
        tol: tol
      });

      if (tol <= tolerancia) {
        break;
      }

      // Verificar división por cero
      if (Math.abs(fpr) < 1e-10) {
        alert('Derivada muy cercana a cero. Newton-Raphson no puede continuar.');
        break;
      }

      // Calcular siguiente r
      r = r - fr / fpr;
      iteracion++;
    }

    return results;
  };

  const handleCalculate = () => {
    if (metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos') {
      const biseccionResults = calculateBiseccion();
      setResultsBiseccion(biseccionResults);
    }

    if (metodoSeleccionado === 'newton' || metodoSeleccionado === 'ambos') {
      const newtonResults = calculateNewton();
      setResultsNewton(newtonResults);
    }

    setShowResults(true);
  };

  const handleReset = () => {
    setMu(3.986e14);
    setT(86400);
    setRadioTierra(6371000);
    setRMin(30000000);
    setRMax(50000000);
    setR0Newton(42000000);
    setTolerancia(1);
    setMetodoSeleccionado('ambos');
    setShowResults(false);
  };

  const radioExacto = calcularRadioExacto();
  const alturaExacta = radioExacto - radioTierra;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Back Button */}
      <button
  onClick={onBack}
  className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors font-semibold text-lg py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
>
  <ArrowLeft className="w-6 h-6 mr-3" />
  Volver a problemas
</button>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Satellite className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Órbita Geoestacionaria de Satélite</h1>
            <p className="text-indigo-100 mt-2">Métodos: Bisección y Newton-Raphson</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-indigo-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Globe className="w-8 h-8 mr-3 text-indigo-500" />
          1. Descripción del Problema
        </h2>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-l-4 border-indigo-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Un <strong>satélite geoestacionario</strong> debe orbitar la Tierra con un período de exactamente 
              <strong> 24 horas</strong> para permanecer fijo sobre un punto del ecuador. ¿A qué <strong>radio 
              orbital r</strong> debe colocarse el satélite?
            </p>

            <div className="grid md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-indigo-200">
                <div className="text-3xl mb-2">🌍</div>
                <p className="text-sm font-semibold text-gray-700">Radio Tierra</p>
                <p className="text-lg font-bold text-blue-600">{(radioTierra/1000).toFixed(0)} km</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-indigo-200">
                <div className="text-3xl mb-2">⏰</div>
                <p className="text-sm font-semibold text-gray-700">Período T</p>
                <p className="text-lg font-bold text-purple-600">24 horas</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-indigo-200">
                <div className="text-3xl mb-2">🛰️</div>
                <p className="text-sm font-semibold text-gray-700">Radio orbital r</p>
                <p className="text-lg text-gray-600">¿? km</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-indigo-200">
                <div className="text-3xl mb-2">📡</div>
                <p className="text-sm font-semibold text-gray-700">Altura h</p>
                <p className="text-lg text-gray-600">r - R<sub>Tierra</sub></p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🛰️ Aplicaciones:</h3>
            <ul className="space-y-2 text-gray-700 grid md:grid-cols-2 gap-2">
              <li>📡 Satélites de telecomunicaciones</li>
              <li>📺 Televisión satelital (DirecTV, Dish)</li>
              <li>🗺️ Sistema GPS y navegación</li>
              <li>🌦️ Satélites meteorológicos</li>
              <li>📞 Comunicaciones globales</li>
              <li>🔬 Investigación espacial</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ECUACIÓN */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Ecuación Orbital
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Mecánica Orbital</h3>
            <p className="text-gray-700 mb-4">
              La velocidad orbital y el período están relacionados por:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Velocidad orbital:</p>
                <p className="text-center text-xl font-bold text-indigo-700">
                  v = √(μ/r)
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Velocidad tangencial:</p>
                <p className="text-center text-xl font-bold text-purple-700">
                  v = 2πr/T
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-2xl font-bold text-purple-700 mb-3">
                f(r) = √(μ/r) - 2πr/T = 0
              </p>
              <p className="text-center text-sm text-gray-600">
                Ecuación trascendente a resolver
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Constantes:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>μ</strong> = {mu.toExponential(3)} m³/s²</li>
                  <li>• <strong>T</strong> = {T} s (24 horas)</li>
                  <li>• <strong>R<sub>Tierra</sub></strong> = {(radioTierra/1000).toFixed(0)} km</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Derivada (para Newton):</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>f'(r)</strong> = -√μ/(2r<sup>3/2</sup>) - 2π/T</li>
                  <li>• Derivada siempre negativa</li>
                  <li>• Función monotónica</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="font-semibold text-gray-800 mb-2">Solución Exacta:</p>
              <p className="text-center text-lg font-bold text-green-700 mb-2">
                r = (T√μ / 2π)<sup>2/3</sup>
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-gray-600">Radio orbital:</p>
                  <p className="text-xl font-bold text-green-700">
                    r ≈ {(radioExacto/1000).toFixed(2)} km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Altura sobre superficie:</p>
                  <p className="text-xl font-bold text-blue-700">
                    h ≈ {(alturaExacta/1000).toFixed(2)} km
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MÉTODOS NUMÉRICOS */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Calculator className="w-8 h-8 mr-3 text-blue-500" />
          3. Métodos Numéricos
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* BISECCIÓN */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔶 BISECCIÓN</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-400 mb-4">
              <div className="space-y-1 text-sm">
                <p className="font-bold">m = (a + b) / 2</p>
                <p>Si f(a)·f(m) {'<'} 0 → b = m</p>
                <p>Sino → a = m</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Método robusto que garantiza encontrar la solución en el intervalo dado.
            </p>
          </div>

          {/* NEWTON-RAPHSON */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔷 NEWTON-RAPHSON</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-indigo-400 mb-4">
              <p className="text-center text-lg font-bold text-indigo-700">
                r<sub>i+1</sub> = r<sub>i</sub> - f(r<sub>i</sub>)/f'(r<sub>i</sub>)
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Convergencia rápida usando la derivada de la función orbital.
            </p>
          </div>
        </div>
      </div>

      {/* CALCULADORA */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calculator className="w-6 h-6 mr-2 text-blue-500" />
          Calculadora Interactiva
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🌍 Parámetro μ (m³/s²)
            </label>
            <input
              type="number"
              value={mu}
              onChange={(e) => setMu(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              step="1e13"
            />
            <p className="text-xs text-gray-500 mt-1">{mu.toExponential(3)}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⏰ Período T (segundos)
            </label>
            <input
              type="number"
              value={T}
              onChange={(e) => setT(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{(T/3600).toFixed(1)} horas</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🌍 Radio Tierra (m)
            </label>
            <input
              type="number"
              value={radioTierra}
              onChange={(e) => setRadioTierra(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{(radioTierra/1000).toFixed(0)} km</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📉 Radio Mínimo (m) - Bisección
            </label>
            <input
              type="number"
              value={rMin}
              onChange={(e) => setRMin(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{(rMin/1000).toFixed(0)} km</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Radio Máximo (m) - Bisección
            </label>
            <input
              type="number"
              value={rMax}
              onChange={(e) => setRMax(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{(rMax/1000).toFixed(0)} km</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Radio Inicial r₀ (m) - Newton
            </label>
            <input
              type="number"
              value={r0Newton}
              onChange={(e) => setR0Newton(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">{(r0Newton/1000).toFixed(0)} km</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚙️ Tolerancia
            </label>
            <input
              type="number"
              step="0.1"
              value={tolerancia}
              onChange={(e) => setTolerancia(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Método a usar
            </label>
            <select
              value={metodoSeleccionado}
              onChange={(e) => setMetodoSeleccionado(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-indigo-300 to-purple-300"
            >
              <option value="biseccion">Bisección</option>
              <option value="newton">Newton-Raphson</option>
              <option value="ambos">Comparar Ambos</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Calcular
          </button>
          <button
            onClick={handleReset}
            className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* RESULTADOS */}
      {showResults && (
        <>
          {/* Tabla Bisección */}
          {(metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos') && resultsBiseccion.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-300 mb-8">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🔶 MÉTODO DE BISECCIÓN</h2>
                <p className="text-sm mt-1">f(r) = √(μ/r) - 2πr/T = 0</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-amber-100">
                      <th className="border-2 border-amber-300 px-3 py-3">#</th>
                      <th className="border-2 border-amber-300 px-3 py-3">a (m)</th>
                      <th className="border-2 border-amber-300 px-3 py-3">b (m)</th>
                      <th className="border-2 border-amber-300 px-3 py-3">m (m)</th>
                      <th className="border-2 border-amber-300 px-3 py-3">f(a)</th>
                      <th className="border-2 border-amber-300 px-3 py-3">f(b)</th>
                      <th className="border-2 border-amber-300 px-3 py-3">f(m)</th>
                      <th className="border-2 border-amber-300 px-3 py-3 bg-yellow-50">tol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsBiseccion.map((row, index) => {
                      const isLast = index === resultsBiseccion.length - 1 && row.tol <= tolerancia;
                      return (
                        <tr key={index} className={isLast ? 'bg-yellow-200' : (index % 2 === 0 ? 'bg-amber-50' : 'bg-white')}>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-semibold">{row.iteracion}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.a.toFixed(2)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.b.toFixed(2)}</td>
                          <td className={`border-2 border-amber-200 px-3 py-2 text-center font-mono font-bold text-xs ${isLast ? 'text-amber-700' : ''}`}>
                            {row.m.toFixed(2)}
                          </td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.fa.toFixed(6)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.fb.toFixed(6)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.fm.toFixed(6)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono bg-yellow-50 text-xs">{row.tol.toFixed(8)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-300">
                <p className="font-semibold text-gray-800 mb-2">Radio orbital encontrado (Bisección):</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Radio desde centro Tierra:</p>
                    <p className="text-3xl font-bold text-amber-600">
                      {(resultsBiseccion[resultsBiseccion.length - 1]?.m / 1000).toFixed(2)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Altura sobre superficie:</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {((resultsBiseccion[resultsBiseccion.length - 1]?.m - radioTierra) / 1000).toFixed(2)} km
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Iteraciones: {resultsBiseccion.length} | Tolerancia: {resultsBiseccion[resultsBiseccion.length - 1]?.tol.toFixed(8)}
                </p>
              </div>
            </div>
          )}

          {/* Tabla Newton-Raphson */}
          {(metodoSeleccionado === 'newton' || metodoSeleccionado === 'ambos') && resultsNewton.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-300 mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg mb-4">
<h2 className="text-2xl font-bold">🔷 MÉTODO DE NEWTON-RAPHSON</h2>
<p className="text-sm mt-1">f(r) = √(μ/r) - 2πr/T = 0</p>
</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="border-2 border-indigo-300 px-3 py-3">#</th>
                  <th className="border-2 border-indigo-300 px-3 py-3">r (m)</th>
                  <th className="border-2 border-indigo-300 px-3 py-3">f(r)</th>
                  <th className="border-2 border-indigo-300 px-3 py-3">f'(r)</th>
                  <th className="border-2 border-indigo-300 px-3 py-3 bg-yellow-50">tol</th>
                </tr>
              </thead>
              <tbody>
                {resultsNewton.map((row, index) => {
                  const isLast = index === resultsNewton.length - 1 && row.tol <= tolerancia;
                  return (
                    <tr key={index} className={isLast ? 'bg-yellow-200' : (index % 2 === 0 ? 'bg-indigo-50' : 'bg-white')}>
                      <td className="border-2 border-indigo-200 px-3 py-2 text-center font-semibold">{row.iteracion}</td>
                      <td className={`border-2 border-indigo-200 px-3 py-2 text-center font-mono font-bold text-xs ${isLast ? 'text-indigo-700' : ''}`}>
                        {row.x.toFixed(2)}
                      </td>
                      <td className="border-2 border-indigo-200 px-3 py-2 text-center font-mono text-xs">{row.fx.toFixed(8)}</td>
                      <td className="border-2 border-indigo-200 px-3 py-2 text-center font-mono text-xs">{row.fpx.toExponential(4)}</td>
                      <td className="border-2 border-indigo-200 px-3 py-2 text-center font-mono bg-yellow-50 text-xs">{row.tol.toFixed(8)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-300">
            <p className="font-semibold text-gray-800 mb-2">Radio orbital encontrado (Newton-Raphson):</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Radio desde centro Tierra:</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {(resultsNewton[resultsNewton.length - 1]?.x / 1000).toFixed(2)} km
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Altura sobre superficie:</p>
                <p className="text-3xl font-bold text-purple-600">
                  {((resultsNewton[resultsNewton.length - 1]?.x - radioTierra) / 1000).toFixed(2)} km
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Iteraciones: {resultsNewton.length} | Tolerancia: {resultsNewton[resultsNewton.length - 1]?.tol.toFixed(8)}
            </p>
          </div>
        </div>
      )}

      {/* COMPARACIÓN */}
      {metodoSeleccionado === 'ambos' && resultsBiseccion.length > 0 && resultsNewton.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-300 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Comparación de Métodos
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border-2 border-amber-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">B</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Bisección</p>
                  <p className="text-xs text-gray-500">Convergencia garantizada</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Radio orbital:</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {(resultsBiseccion[resultsBiseccion.length - 1]?.m / 1000).toFixed(2)} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Altura:</p>
                  <p className="text-xl font-bold text-blue-600">
                    {((resultsBiseccion[resultsBiseccion.length - 1]?.m - radioTierra) / 1000).toFixed(2)} km
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Iteraciones: {resultsBiseccion.length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-indigo-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">N</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Newton-Raphson</p>
                  <p className="text-xs text-gray-500">Convergencia rápida</p>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Radio orbital:</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {(resultsNewton[resultsNewton.length - 1]?.x / 1000).toFixed(2)} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Altura:</p>
                  <p className="text-xl font-bold text-purple-600">
                    {((resultsNewton[resultsNewton.length - 1]?.x - radioTierra) / 1000).toFixed(2)} km
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Iteraciones: {resultsNewton.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-400 shadow-md mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">✓</span>
              <div>
                <p className="text-lg font-semibold text-gray-700">Solución Exacta</p>
                <p className="text-xs text-gray-500">r = (T√μ / 2π)<sup>2/3</sup></p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Radio orbital exacto:</p>
                <p className="text-3xl font-bold text-green-600">
                  {(radioExacto / 1000).toFixed(2)} km
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Altura exacta:</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(alturaExacta / 1000).toFixed(2)} km
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Análisis:</h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ITER. BISECCIÓN</p>
                <p className="text-3xl font-bold text-amber-600">{resultsBiseccion.length}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ITER. NEWTON</p>
                <p className="text-3xl font-bold text-indigo-600">{resultsNewton.length}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">MÁS RÁPIDO</p>
                <p className="text-2xl font-bold text-blue-600">
                  {resultsNewton.length < resultsBiseccion.length ? 'Newton' : 'Bisección'}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="font-bold text-gray-800 mb-2">💡 Conclusiones:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Órbita geoestacionaria a ~{(radioExacto/1000).toFixed(0)} km del centro terrestre</li>
                <li>✓ Altura sobre superficie: ~{(alturaExacta/1000).toFixed(0)} km</li>
                <li>✓ <strong>Newton</strong> convergió en {resultsNewton.length} iteraciones</li>
                <li>✓ <strong>Bisección</strong> necesitó {resultsBiseccion.length} iteraciones</li>
                <li>✓ A esta altura, el satélite completa una órbita en exactamente 24 horas</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Interpretación */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🛰️ Interpretación Espacial</h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start">
            <span className="text-2xl mr-3">📡</span>
            <span>
              Un satélite geoestacionario debe orbitar a{' '}
              <strong className="text-indigo-600 text-xl">
                {(metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos')
                  ? (resultsBiseccion[resultsBiseccion.length - 1]?.m / 1000).toFixed(0)
                  : (resultsNewton[resultsNewton.length - 1]?.x / 1000).toFixed(0)} km
              </strong> del centro de la Tierra.
            </span>
          </p>

          <p className="flex items-start">
  <span className="text-2xl mr-3">🌍</span>
  <span>
    Esto corresponde a una altura de aproximadamente{' '}
    <strong className="text-purple-600 text-xl">
      {((metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos'
        ? (resultsBiseccion[resultsBiseccion.length - 1]?.m - radioTierra)
        : (resultsNewton[resultsNewton.length - 1]?.x - radioTierra)
      ) / 1000).toFixed(0)} km
    </strong> sobre la superficie terrestre.
  </span>
</p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">⏰</span>
            <span>
              A esta distancia, la velocidad orbital iguala la rotación terrestre, 
              permitiendo que el satélite permanezca <strong>estacionario</strong> sobre un punto del ecuador.
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">📺</span>
            <span>
              Esta órbita es crucial para satélites de comunicaciones, GPS y televisión satelital.
            </span>
          </p>
        </div>
      </div>
    </>
  )}
</div>
);
};
export default Orbita;