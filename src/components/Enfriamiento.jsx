import React, { useState } from 'react';
import { ArrowLeft, Calculator, TrendingDown, AlertCircle, BookOpen, Coffee } from 'lucide-react';

const Enfriamiento = ({ onBack }) => {
  // Estados para los inputs
  const [T0, setT0] = useState(90); // Temperatura inicial (°C)
  const [Tamb, setTamb] = useState(20); // Temperatura ambiente (°C)
  const [k, setK] = useState(0.1); // Constante de enfriamiento
  const [h, setH] = useState(1); // Tamaño de paso (minutos)
  const [tFinal, setTFinal] = useState(30); // Tiempo final (minutos)
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('ambos'); // euler, heun, ambos

  // Estados para resultados
  const [resultsEuler, setResultsEuler] = useState([]);
  const [resultsHeun, setResultsHeun] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Función f(t, T) = -k(T - Tamb)
  const f = (t, T) => {
    return -k * (T - Tamb);
  };

  // Solución exacta: T(t) = Tamb + (T0 - Tamb)e^(-kt)
  const temperaturaExacta = (t) => {
    return Tamb + (T0 - Tamb) * Math.exp(-k * t);
  };

  // Método de Euler
  const calculateEuler = () => {
    const results = [];
    let t = 0;
    let T = T0;
    const steps = Math.floor(tFinal / h);

    for (let i = 0; i <= steps; i++) {
      const ft = f(t, T);
      const Texacta = temperaturaExacta(t);
      const error = Math.abs(T - Texacta);
      
      results.push({
        iteration: i,
        t: t,
        T: T,
        h: h,
        ft: ft,
        Texacta: Texacta,
        error: error,
        formula: i === 0 ? `T(0) = ${T0}°C` : `T${i} = T${i-1} + h·f(t${i-1},T${i-1})`
      });
      
      if (i < steps) {
        T = T + h * ft;
        t = t + h;
      }
    }

    return results;
  };

  // Método de Heun
  const calculateHeun = () => {
    const results = [];
    let t = 0;
    let T = T0;
    const steps = Math.floor(tFinal / h);

    for (let i = 0; i <= steps; i++) {
      const Texacta = temperaturaExacta(t);
      const error = Math.abs(T - Texacta);
      
      if (i === 0) {
        // Iteración 0 - solo valores iniciales
        results.push({
          iteration: 0,
          t: t,
          T: T,
          h: h,
          k1: '-',
          tnh: '-',
          hk1: '-',
          Thk1: '-',
          k2: '-',
          Texacta: Texacta,
          error: error,
          formula: `T(0) = ${T0}°C`
        });
      } else {
        // Iteraciones siguientes
        // 1. Cálculo de k1 (pendiente inicial)
        const k1 = f(t, T);
        
        // 2. Estimación tipo Euler
        const tnh = t + h;
        const hk1 = h * k1;
        const Thk1 = T + hk1;
        
        // 3. Cálculo de k2 (pendiente corregida)
        const k2 = f(tnh, Thk1);
        
        // 4. Fórmula final de Heun
        const Tnext = T + (h / 2) * (k1 + k2);
        
        results.push({
          iteration: i,
          t: tnh,
          T: Tnext,
          h: h,
          k1: k1,
          tnh: tnh,
          hk1: hk1,
          Thk1: Thk1,
          k2: k2,
          Texacta: temperaturaExacta(tnh),
          error: Math.abs(Tnext - temperaturaExacta(tnh)),
          formula: `T${i} = T${i-1} + (h/2)(k1+k2)`
        });
        
        T = Tnext;
        t = tnh;
      }
    }

    return results;
  };

  const handleCalculate = () => {
    if (metodoSeleccionado === 'euler' || metodoSeleccionado === 'ambos') {
      const eulerResults = calculateEuler();
      setResultsEuler(eulerResults);
    }
    
    if (metodoSeleccionado === 'heun' || metodoSeleccionado === 'ambos') {
      const heunResults = calculateHeun();
      setResultsHeun(heunResults);
    }
    
    setShowResults(true);
  };

  const handleReset = () => {
    setT0(90);
    setTamb(20);
    setK(0.1);
    setH(1);
    setTFinal(30);
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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Coffee className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Ley de Enfriamiento de Newton</h1>
            <p className="text-orange-100 mt-2">Métodos Numéricos: Euler y Heun</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-orange-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Coffee className="w-8 h-8 mr-3 text-orange-500" />
          1. Descripción del Problema
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border-l-4 border-orange-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Una <strong>taza de café caliente</strong> a 90°C se coloca en una habitación a 20°C. 
              Con el tiempo, el café se <strong>enfría gradualmente</strong> hasta alcanzar la temperatura ambiente.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-orange-200">
                <div className="text-3xl mb-2">☕</div>
                <p className="text-sm font-semibold text-gray-700">Café Inicial</p>
                <p className="text-2xl font-bold text-orange-600">90°C</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-orange-200">
                <div className="text-3xl mb-2">⏱️</div>
                <p className="text-sm font-semibold text-gray-700">Después de 30 min</p>
                <p className="text-lg text-gray-600">¿? °C</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-orange-200">
                <div className="text-3xl mb-2">🏠</div>
                <p className="text-sm font-semibold text-gray-700">Ambiente</p>
                <p className="text-2xl font-bold text-blue-600">20°C</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">📋 Aplicaciones:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>☕ Calcular tiempo de enfriamiento de bebidas</li>
              <li>🔬 Medicina forense: determinar hora de muerte</li>
              <li>🍲 Industria alimentaria: control de temperatura</li>
              <li>❄️ Diseño de sistemas de refrigeración</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ECUACIÓN DIFERENCIAL */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Ecuación Diferencial
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Ley de Newton</h3>
            <p className="text-gray-700 mb-4">
              La <strong>velocidad de enfriamiento</strong> es proporcional a la diferencia de temperatura:
            </p>
            
            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-3xl font-bold text-purple-700 mb-3">
                dT/dt = -k(T - T<sub>amb</sub>)
              </p>
              <p className="text-center text-sm text-gray-600">
                Donde k = {k} es la constante de enfriamiento
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Variables:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>T(t):</strong> Temperatura en tiempo t</li>
                  <li>• <strong>T<sub>amb</sub>:</strong> Temperatura ambiente</li>
                  <li>• <strong>k:</strong> Constante de enfriamiento</li>
                  <li>• <strong>t:</strong> Tiempo (minutos)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Valores:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• T(0) = {T0}°C (inicial)</li>
                  <li>• T<sub>amb</sub> = {Tamb}°C</li>
                  <li>• k = {k} min⁻¹</li>
                  <li>• t<sub>final</sub> = {tFinal} minutos</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="font-semibold text-gray-800 mb-2">Solución Exacta:</p>
              <p className="text-center text-xl font-bold text-green-700">
                T(t) = T<sub>amb</sub> + (T<sub>0</sub> - T<sub>amb</sub>)e<sup>-kt</sup>
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                T(t) = {Tamb} + ({T0} - {Tamb})e<sup>-{k}t</sup>
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
          {/* EULER */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔶 EULER</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-400 mb-4">
              <p className="text-center text-xl font-bold text-orange-700">
                T<sub>i+1</sub> = T<sub>i</sub> + h · f(t<sub>i</sub>, T<sub>i</sub>)
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa <strong>una sola pendiente</strong> (la inicial) para estimar el siguiente valor. 
              Es simple pero menos preciso.
            </p>
          </div>

          {/* HEUN */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔷 HEUN</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-purple-400 mb-4">
              <div className="space-y-1 text-sm">
                <p><strong>k₁</strong> = f(t<sub>n</sub>, T<sub>n</sub>)</p>
                <p><strong>k₂</strong> = f(t<sub>n</sub>+h, T<sub>n</sub>+h·k₁)</p>
                <p className="text-center text-lg font-bold text-purple-700 mt-2">
                  T<sub>n+1</sub> = T<sub>n</sub> + (h/2)(k₁ + k₂)
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Promedia <strong>dos pendientes</strong> (inicial y final) para mayor precisión.
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
              🌡️ Temperatura Inicial (°C)
            </label>
            <input
              type="number"
              value={T0}
              onChange={(e) => setT0(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏠 Temperatura Ambiente (°C)
            </label>
            <input
              type="number"
              value={Tamb}
              onChange={(e) => setTamb(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚙️ Constante k (min⁻¹)
            </label>
            <input
              type="number"
              step="0.01"
              value={k}
              onChange={(e) => setK(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📏 Paso h (minutos)
            </label>
            <input
              type="number"
              step="0.1"
              value={h}
              onChange={(e) => setH(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⏱️ Tiempo Final (minutos)
            </label>
            <input
              type="number"
              value={tFinal}
              onChange={(e) => setTFinal(parseFloat(e.target.value))}
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-orange-300 to-red-300"
            >
              <option value="euler">Solución Euler</option>
              <option value="heun">Solución Heun</option>
              <option value="ambos">Comparar Ambos</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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
          {/* Tabla Euler */}
          {(metodoSeleccionado === 'euler' || metodoSeleccionado === 'ambos') && resultsEuler.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-300 mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🔶 MÉTODO DE EULER</h2>
                <p className="text-sm mt-1">T<sub>i+1</sub> = T<sub>i</sub> + h · f(t<sub>i</sub>, T<sub>i</sub>)</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="border-2 border-orange-300 px-3 py-3">#</th>
                      <th className="border-2 border-orange-300 px-3 py-3">t (min)</th>
                      <th className="border-2 border-orange-300 px-3 py-3">T(t) °C</th>
                      <th className="border-2 border-orange-300 px-3 py-3">h</th>
                      <th className="border-2 border-orange-300 px-3 py-3">f(t,T)</th>
                      <th className="border-2 border-orange-300 px-3 py-3 bg-green-50">T Exacta</th>
                      <th className="border-2 border-orange-300 px-3 py-3 bg-yellow-50">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsEuler.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-orange-50' : 'bg-white'}>
                        <td className="border-2 border-orange-200 px-3 py-2 text-center font-semibold">{row.iteration}</td>
                        <td className="border-2 border-orange-200 px-3 py-2 text-center">{row.t.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-3 py-2 text-center font-mono font-bold">{row.T.toFixed(6)}</td>
                        <td className="border-2 border-orange-200 px-3 py-2 text-center">{row.h}</td>
                        <td className="border-2 border-orange-200 px-3 py-2 text-center font-mono">{row.ft.toFixed(6)}</td>
                        <td className="border-2 border-orange-200 px-3 py-2 text-center font-mono bg-green-50">{row.Texacta.toFixed(6)}</td>
                        <td className="border-2 border-orange-200 px-3 py-2 text-center font-mono bg-yellow-50">{row.error.toFixed(8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="font-semibold text-gray-800 mb-2">Resultado Final (Euler):</p>
                <p className="text-2xl font-bold text-orange-600">
                  T({tFinal} min) = {resultsEuler[resultsEuler.length - 1]?.T.toFixed(4)}°C
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ☕ El café se enfrió de <strong>{T0}°C</strong> a <strong>{resultsEuler[resultsEuler.length - 1]?.T.toFixed(2)}°C</strong> en {tFinal} minutos.
                </p>
              </div>
            </div>
          )}

          {/* Tabla Heun */}
          {(metodoSeleccionado === 'heun' || metodoSeleccionado === 'ambos') && resultsHeun.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-300 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🔷 MÉTODO DE HEUN</h2>
                <p className="text-sm mt-1">T<sub>n+1</sub> = T<sub>n</sub> + (h/2)(k₁ + k₂)</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="border-2 border-purple-300 px-2 py-3">#</th>
                      <th className="border-2 border-purple-300 px-2 py-3">t (min)</th>
                      <th className="border-2 border-purple-300 px-2 py-3">T(t) °C</th>
                      <th className="border-2 border-purple-300 px-2 py-3">h</th>
                      <th className="border-2 border-purple-300 px-2 py-3 bg-blue-50">k₁<br/>f(t,T)</th>
                      <th className="border-2 border-purple-300 px-2 py-3 bg-green-50">t+h</th>
                      <th className="border-2 border-purple-300 px-2 py-3 bg-green-50">h·k₁</th>
                      <th className="border-2 border-purple-300 px-2 py-3 bg-green-50">T+h·k₁</th>
                      <th className="border-2 border-purple-300 px-2 py-3 bg-yellow-50">k₂</th>
                      <th className="border-2 border-purple-300 px-2 py-3 bg-pink-50">T Exacta</th>
                      <th className="border-2 border-purple-300 px-2 py-3 bg-red-50">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsHeun.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-semibold">{row.iteration}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center">{typeof row.t === 'number' ? row.t.toFixed(2) : row.t}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-mono font-bold">{typeof row.T === 'number' ? row.T.toFixed(6) : row.T}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center">{row.h}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-mono bg-blue-50">{typeof row.k1 === 'number' ? row.k1.toFixed(6) : row.k1}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center bg-green-50">{typeof row.tnh === 'number' ? row.tnh.toFixed(2) : row.tnh}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-mono bg-green-50">{typeof row.hk1 === 'number' ? row.hk1.toFixed(6) : row.hk1}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-mono bg-green-50">{typeof row.Thk1 === 'number' ? row.Thk1.toFixed(6) : row.Thk1}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-mono bg-yellow-50">{typeof row.k2 === 'number' ? row.k2.toFixed(6) : row.k2}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-mono bg-pink-50">{typeof row.Texacta === 'number' ? row.Texacta.toFixed(6) : row.Texacta}</td>
                        <td className="border-2 border-purple-200 px-2 py-2 text-center font-mono bg-red-50">{typeof row.error === 'number' ? row.error.toFixed(8) : row.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-gray-800 mb-2">Resultado Final (Heun):</p>
                <p className="text-2xl font-bold text-purple-600">
                  T({tFinal} min) = {resultsHeun[resultsHeun.length - 1]?.T.toFixed(4)}°C
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ☕ El café se enfrió de <strong>{T0}°C</strong> a <strong>{resultsHeun[resultsHeun.length - 1]?.T.toFixed(2)}°C</strong> en {tFinal} minutos.
                </p>
              </div>
            </div>
          )}

          {/* COMPARACIÓN CUANDO SE CALCULAN AMBOS MÉTODOS */}
          {metodoSeleccionado === 'ambos' && resultsEuler.length > 0 && resultsHeun.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-300 shadow-xl">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Comparación de Métodos
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Resultado Euler */}
                <div className="bg-white rounded-xl p-6 border-2 border-orange-300 shadow-md">
                  <div className="flex items-center mb-4">
                    <span className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">E</span>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Método de Euler</p>
                      <p className="text-xs text-gray-500">Más simple, menos preciso</p>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-600 mb-2">Temperatura Final:</p>
                    <p className="text-4xl font-bold text-orange-600">
                      {resultsEuler[resultsEuler.length - 1]?.T.toFixed(4)}°C
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Error vs exacta: {resultsEuler[resultsEuler.length - 1]?.error.toFixed(6)}°C</p>
                  </div>
                </div>
                
                {/* Resultado Heun */}
                <div className="bg-white rounded-xl p-6 border-2 border-purple-300 shadow-md">
                  <div className="flex items-center mb-4">
                    <span className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">H</span>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Método de Heun</p>
                      <p className="text-xs text-gray-500">Más complejo, más preciso</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-2">Temperatura Final:</p>
                    <p className="text-4xl font-bold text-purple-600">
                      {resultsHeun[resultsHeun.length - 1]?.T.toFixed(4)}°C
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Error vs exacta: {resultsHeun[resultsHeun.length - 1]?.error.toFixed(6)}°C</p>
                  </div>
                </div>
              </div>

              {/* Solución Exacta */}
              <div className="bg-white rounded-xl p-6 border-2 border-green-400 shadow-md mb-6">
                <div className="flex items-center mb-4">
                  <span className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">✓</span>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Solución Exacta</p>
                    <p className="text-xs text-gray-500">T(t) = T<sub>amb</sub> + (T<sub>0</sub> - T<sub>amb</sub>)e<sup>-kt</sup></p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-2">Temperatura Final (Exacta):</p>
                  <p className="text-4xl font-bold text-green-600">
                    {temperaturaExacta(tFinal).toFixed(4)}°C
                  </p>
                </div>
              </div>

              {/* Análisis Comparativo */}
              <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Análisis Comparativo</h4>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">DIFERENCIA EULER vs EXACTA</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {resultsEuler[resultsEuler.length - 1]?.error.toFixed(6)}°C
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {((resultsEuler[resultsEuler.length - 1]?.error / temperaturaExacta(tFinal)) * 100).toFixed(3)}% error relativo
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">DIFERENCIA HEUN vs EXACTA</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {resultsHeun[resultsHeun.length - 1]?.error.toFixed(6)}°C
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {((resultsHeun[resultsHeun.length - 1]?.error / temperaturaExacta(tFinal)) * 100).toFixed(3)}% error relativo
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">DIFERENCIA EULER vs HEUN</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.abs(resultsEuler[resultsEuler.length - 1]?.T - resultsHeun[resultsHeun.length - 1]?.T).toFixed(6)}°C
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Heun es más preciso
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="font-bold text-gray-800 mb-2">Conclusiones:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ <strong>Heun</strong> es más preciso que <strong>Euler</strong> (menor error)</li>
                    <li>✓ Con paso h = {h} min, ambos métodos dan resultados razonables</li>
                    <li>✓ Para mayor precisión, reducir el tamaño del paso h</li>
                    <li>✓ El café inicial ({T0}°C) se enfría a ~{temperaturaExacta(tFinal).toFixed(1)}°C en {tFinal} minutos</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Interpretación del Resultado */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300 mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">☕ Interpretación Práctica</h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="text-2xl mr-3">🌡️</span>
                <span>
                  Tu café empezó a <strong>{T0}°C</strong> y después de <strong>{tFinal} minutos</strong> está a aproximadamente{' '}
                  <strong className="text-orange-600">
                    {(metodoSeleccionado === 'euler' || metodoSeleccionado === 'ambos') 
                      ? resultsEuler[resultsEuler.length - 1]?.T.toFixed(1) 
                      : resultsHeun[resultsHeun.length - 1]?.T.toFixed(1)}°C
                  </strong>
                </span>
              </p>
              
              <p className="flex items-start">
                <span className="text-2xl mr-3">⏱️</span>
                <span>
                  La temperatura ambiente es <strong>{Tamb}°C</strong>. Con el tiempo suficiente, el café alcanzará esta temperatura (equilibrio térmico).
                </span>
              </p>
              
              <p className="flex items-start">
                <span className="text-2xl mr-3">📉</span>
                <span>
                  La velocidad de enfriamiento es <strong>más rápida al inicio</strong> (cuando la diferencia de temperatura es mayor) 
                  y se desacelera gradualmente.
                </span>
              </p>

              <p className="flex items-start">
                <span className="text-2xl mr-3">🎯</span>
                <span>
                  La constante <strong>k = {k}</strong> determina qué tan rápido se enfría. 
                  Un k mayor significa enfriamiento más rápido.
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Enfriamiento;