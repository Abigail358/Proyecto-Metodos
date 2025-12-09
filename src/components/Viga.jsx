import React, { useState } from 'react';
import { ArrowLeft, Calculator, Target, BookOpen, Box } from 'lucide-react';

const Viga = ({ onBack }) => {
  // Estados para los inputs
  const [volumenObjetivo, setVolumenObjetivo] = useState(750); // cm³
  const [a, setA] = useState(5); // Límite inferior para Bisección
  const [b, setB] = useState(15); // Límite superior para Bisección
  const [x0, setX0] = useState(10); // Valor inicial para Newton-Raphson
  const [tolerancia, setTolerancia] = useState(0.0001);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('ambos');

  // Estados para resultados
  const [resultsBiseccion, setResultsBiseccion] = useState([]);
  const [resultsNewton, setResultsNewton] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Función f(x) = x³ - volumen
  const f = (x) => {
    return Math.pow(x, 3) - volumenObjetivo;
  };

  // Derivada f'(x) = 3x²
  const fPrima = (x) => {
    return 3 * Math.pow(x, 2);
  };

  // Método de Bisección
  const calculateBiseccion = () => {
    const results = [];
    let aActual = a;
    let bActual = b;
    let iteracion = 0;
    const maxIter = 100;

    // Verificar que hay cambio de signo
    if (f(aActual) * f(bActual) > 0) {
      alert('No hay cambio de signo en el intervalo [a, b]. Método de Bisección no aplicable.');
      return [];
    }

    while (iteracion < maxIter) {
      const m = (aActual + bActual) / 2;
      const fa = f(aActual);
      const fb = f(bActual);
      const fm = f(m);
      const tol = Math.abs(fm);

      results.push({
        iteracion: iteracion,
        a: aActual,
        b: bActual,
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
        bActual = m;
      } else {
        aActual = m;
      }

      iteracion++;
    }

    return results;
  };

  // Método de Newton-Raphson
  const calculateNewton = () => {
    const results = [];
    let x = x0;
    let iteracion = 0;
    const maxIter = 100;

    while (iteracion < maxIter) {
      const fx = f(x);
      const fpx = fPrima(x);
      const tol = Math.abs(fx);

      results.push({
        iteracion: iteracion,
        x: x,
        fx: fx,
        fpx: fpx,
        tol: tol
      });

      if (tol <= tolerancia) {
        break;
      }

      // Verificar división por cero
      if (Math.abs(fpx) < 1e-10) {
        alert('Derivada muy cercana a cero. Newton-Raphson no puede continuar.');
        break;
      }

      // Calcular siguiente x
      x = x - fx / fpx;
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
    setVolumenObjetivo(750);
    setA(5);
    setB(15);
    setX0(10);
    setTolerancia(0.0001);
    setMetodoSeleccionado('ambos');
    setShowResults(false);
  };

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
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Box className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Diseño de Viga Cúbica</h1>
            <p className="text-amber-100 mt-2">Métodos: Bisección y Newton-Raphson</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-amber-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Target className="w-8 h-8 mr-3 text-amber-500" />
          1. Descripción del Problema
        </h2>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border-l-4 border-amber-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Una empresa de construcción necesita diseñar una <strong>viga de acero cúbica</strong> que 
              tenga exactamente <strong>{volumenObjetivo} cm³</strong> de volumen para soportar una carga específica. 
              ¿Cuál debe ser la <strong>longitud del lado (x)</strong>?
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-amber-200">
                <div className="text-3xl mb-2">📦</div>
                <p className="text-sm font-semibold text-gray-700">Volumen Requerido</p>
                <p className="text-2xl font-bold text-amber-600">{volumenObjetivo} cm³</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-amber-200">
                <div className="text-3xl mb-2">📏</div>
                <p className="text-sm font-semibold text-gray-700">Lado de la viga</p>
                <p className="text-lg text-gray-600">x = ?</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-amber-200">
                <div className="text-3xl mb-2">🏗️</div>
                <p className="text-sm font-semibold text-gray-700">Forma</p>
                <p className="text-sm text-gray-600">Cubo: x × x × x</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ECUACIÓN */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Ecuación a Resolver
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Planteamiento</h3>
            <p className="text-gray-700 mb-4">
              El volumen de un cubo es <strong>V = x³</strong>. Si necesitamos que sea igual a {volumenObjetivo} cm³:
            </p>

            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-3xl font-bold text-purple-700 mb-3">
                f(x) = x³ - {volumenObjetivo} = 0
              </p>
              <p className="text-center text-sm text-gray-600">
                Encontrar la raíz x donde f(x) = 0
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Función:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>f(x) = x³ - {volumenObjetivo}</strong></li>
                  <li>• Ecuación cúbica</li>
                  <li>• Una raíz real positiva</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Derivada (para Newton):</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>f'(x) = 3x²</strong></li>
                  <li>• Derivada simple</li>
                  <li>• Siempre positiva para x {'>'} 0</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="font-semibold text-gray-800 mb-2">Solución Exacta:</p>
              <p className="text-center text-xl font-bold text-green-700">
                x = ∛{volumenObjetivo} ≈ {Math.pow(volumenObjetivo, 1/3).toFixed(6)} cm
              </p>
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
              Divide el intervalo a la mitad en cada iteración hasta encontrar la raíz.
            </p>
          </div>

          {/* NEWTON-RAPHSON */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border-2 border-rose-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔷 NEWTON-RAPHSON</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-rose-400 mb-4">
              <p className="text-center text-lg font-bold text-rose-700">
                x<sub>i+1</sub> = x<sub>i</sub> - f(x<sub>i</sub>)/f'(x<sub>i</sub>)
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa la tangente de la función para aproximarse rápidamente a la raíz.
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
              📦 Volumen Objetivo (cm³)
            </label>
            <input
              type="number"
              value={volumenObjetivo}
              onChange={(e) => setVolumenObjetivo(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📉 Límite Inferior [a] - Bisección
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Límite Superior [b] - Bisección
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Valor Inicial x₀ - Newton
            </label>
            <input
              type="number"
              value={x0}
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚙️ Tolerancia
            </label>
            <input
              type="number"
              step="0.0001"
              value={tolerancia}
              onChange={(e) => setTolerancia(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Método a usar
            </label>
            <select
              value={metodoSeleccionado}
              onChange={(e) => setMetodoSeleccionado(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-amber-300 to-orange-300"
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
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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
                <p className="text-sm mt-1">f(x) = x³ - {volumenObjetivo} = 0</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-amber-100">
                      <th className="border-2 border-amber-300 px-3 py-3">#</th>
                      <th className="border-2 border-amber-300 px-3 py-3">a</th>
                      <th className="border-2 border-amber-300 px-3 py-3">b</th>
                      <th className="border-2 border-amber-300 px-3 py-3">m</th>
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
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono">{row.a.toFixed(8)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono">{row.b.toFixed(8)}</td>
                          <td className={`border-2 border-amber-200 px-3 py-2 text-center font-mono font-bold ${isLast ? 'text-amber-700' : ''}`}>
                            {row.m.toFixed(8)}
                          </td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.fa.toFixed(8)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.fb.toFixed(8)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono text-xs">{row.fm.toFixed(8)}</td>
                          <td className="border-2 border-amber-200 px-3 py-2 text-center font-mono bg-yellow-50">{row.tol.toFixed(10)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-300">
                <p className="font-semibold text-gray-800 mb-2">Raíz encontrada (Bisección):</p>
                <p className="text-3xl font-bold text-amber-600">
                  x ≈ {resultsBiseccion[resultsBiseccion.length - 1]?.m.toFixed(6)} cm
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Lado de la viga cúbica con volumen de {volumenObjetivo} cm³
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Iteraciones: {resultsBiseccion.length} | Tolerancia alcanzada: {resultsBiseccion[resultsBiseccion.length - 1]?.tol.toFixed(10)}
                </p>
              </div>
            </div>
          )}

          {/* Tabla Newton-Raphson */}
          {(metodoSeleccionado === 'newton' || metodoSeleccionado === 'ambos') && resultsNewton.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-rose-300 mb-8">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🔷 MÉTODO DE NEWTON-RAPHSON</h2>
                <p className="text-sm mt-1">f(x) = x³ - {volumenObjetivo} = 0</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-rose-100">
                      <th className="border-2 border-rose-300 px-3 py-3">#</th>
                      <th className="border-2 border-rose-300 px-3 py-3">x</th>
                      <th className="border-2 border-rose-300 px-3 py-3">f(x)</th>
                      <th className="border-2 border-rose-300 px-3 py-3">f'(x)</th>
                      <th className="border-2 border-rose-300 px-3 py-3 bg-yellow-50">tol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsNewton.map((row, index) => {
                      const isLast = index === resultsNewton.length - 1 && row.tol <= tolerancia;
                      return (
                        <tr key={index} className={isLast ? 'bg-yellow-200' : (index % 2 === 0 ? 'bg-rose-50' : 'bg-white')}>
                          <td className="border-2 border-rose-200 px-3 py-2 text-center font-semibold">{row.iteracion}</td>
                          <td className={`border-2 border-rose-200 px-3 py-2 text-center font-mono font-bold ${isLast ? 'text-rose-700' : ''}`}>
                            {row.x.toFixed(8)}
                          </td>
                          <td className="border-2 border-rose-200 px-3 py-2 text-center font-mono text-xs">{row.fx.toFixed(10)}</td>
                          <td className="border-2 border-rose-200 px-3 py-2 text-center font-mono text-xs">{row.fpx.toFixed(8)}</td>
                          <td className="border-2 border-rose-200 px-3 py-2 text-center font-mono bg-yellow-50">{row.tol.toFixed(10)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-rose-50 rounded-lg p-4 border border-rose-300">
                <p className="font-semibold text-gray-800 mb-2">Raíz encontrada (Newton-Raphson):</p>
                <p className="text-3xl font-bold text-rose-600">
                  x ≈ {resultsNewton[resultsNewton.length - 1]?.x.toFixed(6)} cm
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Lado de la viga cúbica con volumen de {volumenObjetivo} cm³
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Iteraciones: {resultsNewton.length} | Tolerancia alcanzada: {resultsNewton[resultsNewton.length - 1]?.tol.toFixed(10)}
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
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-600 mb-2">Raíz encontrada:</p>
                    <p className="text-4xl font-bold text-amber-600">
                      {resultsBiseccion[resultsBiseccion.length - 1]?.m.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Iteraciones: {resultsBiseccion.length}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-rose-300 shadow-md">
                  <div className="flex items-center mb-4">
                    <span className="bg-rose-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">N</span>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Newton-Raphson</p>
                      <p className="text-xs text-gray-500">Convergencia rápida</p>
                    </div>
                  </div>
                  <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                    <p className="text-sm text-gray-600 mb-2">Raíz encontrada:</p>
                    <p className="text-4xl font-bold text-rose-600">
                      {resultsNewton[resultsNewton.length - 1]?.x.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
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
                <p className="text-xs text-gray-500">x = ∛{volumenObjetivo}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Valor Exacto:</p>
              <p className="text-4xl font-bold text-green-600">
                {Math.pow(volumenObjetivo, 1/3).toFixed(6)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Análisis Comparativo:</h4>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ITERACIONES BISECCIÓN</p>
                <p className="text-3xl font-bold text-amber-600">{resultsBiseccion.length}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ITERACIONES NEWTON</p>
                <p className="text-3xl font-bold text-rose-600">{resultsNewton.length}</p>
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
                <li>✓ <strong>Newton-Raphson</strong> converge en {resultsNewton.length} iteraciones (más rápido)</li>
                <li>✓ <strong>Bisección</strong> requiere {resultsBiseccion.length} iteraciones pero es más robusto</li>
                <li>✓ Ambos métodos encuentran x ≈ {Math.pow(volumenObjetivo, 1/3).toFixed(2)} cm</li>
                <li>✓ La viga cúbica de lado {Math.pow(volumenObjetivo, 1/3).toFixed(2)} cm tiene volumen {volumenObjetivo} cm³</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Interpretación */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🏗️ Interpretación Práctica</h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start">
            <span className="text-2xl mr-3">📏</span>
            <span>
              La viga cúbica debe tener un lado de aproximadamente{' '}
              <strong className="text-amber-600 text-xl">
                {(metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos')
                  ? resultsBiseccion[resultsBiseccion.length - 1]?.m.toFixed(2)
                  : resultsNewton[resultsNewton.length - 1]?.x.toFixed(2)} cm
              </strong>
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">📦</span>
            <span>
              Con estas dimensiones, el volumen será exactamente <strong>{volumenObjetivo} cm³</strong>, 
              cumpliendo con los requisitos estructurales.
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">🎯</span>
            <span>
              Newton-Raphson converge más rápido ({resultsNewton.length} iteraciones) pero requiere calcular 
              la derivada. Bisección es más simple pero necesita más pasos ({resultsBiseccion.length} iteraciones).
            </span>
          </p>
        </div>
      </div>
    </>
  )}
</div>
);
};
export default Viga;