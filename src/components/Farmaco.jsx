import React, { useState } from 'react';
import { ArrowLeft, Calculator, Pill, BookOpen, Activity } from 'lucide-react';

const Farmaco = ({ onBack }) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(10);
  const [n, setN] = useState(10);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('todos');

  const [resultsTrapecio, setResultsTrapecio] = useState(null);
  const [resultsSimpson13, setResultsSimpson13] = useState(null);
  const [resultsSimpson38, setResultsSimpson38] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const f = (t) => 10 * t * Math.exp(-0.5 * t);

  const solucionExacta = () => {
    const evaluar = (t) => -40 * Math.exp(-0.5 * t) - 20 * t * Math.exp(-0.5 * t);
    return evaluar(b) - evaluar(a);
  };

  const calculateTrapecio = () => {
    const h = (b - a) / n;
    const results = [];
    
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      results.push({ i, x, y, h });
    }
    
    let suma = results[0].y + results[n].y;
    for (let i = 1; i < n; i++) {
      suma += 2 * results[i].y;
    }
    const aproximacion = (h / 2) * suma;
    
    return { results, aproximacion };
  };

  const calculateSimpson13 = () => {
    if (n % 2 !== 0) {
      return { results: [], aproximacion: null, error: 'n debe ser PAR' };
    }
    
    const h = (b - a) / n;
    const results = [];
    
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      results.push({ i, x, y, h });
    }
    
    let sumaImpares = 0;
    let sumaPares = 0;
    
    for (let i = 1; i < n; i++) {
      if (i % 2 !== 0) {
        sumaImpares += results[i].y;
      } else {
        sumaPares += results[i].y;
      }
    }
    
    const aproximacion = (h / 3) * (results[0].y + results[n].y + 4 * sumaImpares + 2 * sumaPares);
    
    return { results, aproximacion };
  };

  const calculateSimpson38 = () => {
    if (n % 3 !== 0) {
      return { results: [], aproximacion: null, error: 'n debe ser MÚLTIPLO DE 3' };
    }
    
    const h = (b - a) / n;
    const results = [];
    
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      results.push({ i, x, y, h });
    }
    
    let sumaMultiplo3 = 0;
    let sumaResto = 0;
    
    for (let i = 1; i < n; i++) {
      if (i % 3 === 0) {
        sumaMultiplo3 += results[i].y;
      } else {
        sumaResto += results[i].y;
      }
    }
    
    const aproximacion = (3 * h / 8) * (results[0].y + results[n].y + 2 * sumaMultiplo3 + 3 * sumaResto);
    
    return { results, aproximacion };
  };

  const handleCalculate = () => {
    // Limpiar resultados previos
    setResultsTrapecio(null);
    setResultsSimpson13(null);
    setResultsSimpson38(null);

    if (metodoSeleccionado === 'trapecio' || metodoSeleccionado === 'todos') {
      const res = calculateTrapecio();
      setResultsTrapecio(res);
    }

    if (metodoSeleccionado === 'simpson13' || metodoSeleccionado === 'todos') {
      const res = calculateSimpson13();
      if (!res.error) {
        setResultsSimpson13(res);
      }
    }

    if (metodoSeleccionado === 'simpson38' || metodoSeleccionado === 'todos') {
      const res = calculateSimpson38();
      if (!res.error) {
        setResultsSimpson38(res);
      }
    }

    setShowResults(true);
  };

  const handleReset = () => {
    setA(0);
    setB(10);
    setN(10);
    setMetodoSeleccionado('todos');
    setShowResults(false);
    setResultsTrapecio(null);
    setResultsSimpson13(null);
    setResultsSimpson38(null);
  };

  const exacta = solucionExacta();

  // Verificar qué métodos son válidos con el n actual
  const nEsPar = n % 2 === 0;
  const nEsMultiplo3 = n % 3 === 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
  onClick={onBack}
  className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors font-semibold text-lg py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
>
  <ArrowLeft className="w-6 h-6 mr-3" />
  Volver a problemas
</button>

      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Concentración de Fármaco en Sangre</h1>
            <p className="text-pink-100 mt-2">Métodos: Trapecio, Simpson 1/3 y Simpson 3/8</p>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-pink-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Activity className="w-8 h-8 mr-3 text-pink-500" />
          1. Descripción del Problema
        </h2>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6 border-l-4 border-pink-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Después de administrar un medicamento vía intravenosa, la <strong>concentración del fármaco en la sangre</strong> 
              varía con el tiempo siguiendo una función matemática. El <strong>Área Bajo la Curva (AUC)</strong> es una 
              métrica fundamental en farmacocinética que indica la <strong>exposición total del paciente al medicamento</strong>.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-pink-200">
                <div className="text-3xl mb-2">💉</div>
                <p className="text-sm font-semibold text-gray-700">Administración</p>
                <p className="text-xs text-gray-500">t = 0 horas</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-pink-200">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-sm font-semibold text-gray-700">Monitoreo</p>
                <p className="text-xs text-gray-500">0 a {b} horas</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-pink-200">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-sm font-semibold text-gray-700">AUC (Objetivo)</p>
                <p className="text-xs text-gray-500">mg·h/L</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🏥 Aplicaciones Clínicas:</h3>
            <ul className="space-y-2 text-gray-700 grid md:grid-cols-2 gap-2">
              <li>💊 Determinación de dosis efectivas</li>
              <li>🧪 Estudios de biodisponibilidad</li>
              <li>⚖️ Comparación de formulaciones</li>
              <li>📊 Farmacocinética clínica</li>
              <li>🎯 Ajuste de dosis personalizada</li>
              <li>🔬 Ensayos clínicos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FUNCIÓN DE CONCENTRACIÓN */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Función de Concentración
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Modelo Farmacocinético</h3>
            <p className="text-gray-700 mb-4">
              La concentración del fármaco en sangre sigue un modelo de <strong>eliminación de primer orden</strong>:
            </p>

            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-3xl font-bold text-purple-700 mb-3">
                C(t) = 10t · e<sup>-0.5t</sup>
              </p>
              <p className="text-center text-sm text-gray-600">
                Concentración en mg/L en función del tiempo t (horas)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Componentes:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>10t:</strong> Absorción del fármaco</li>
                  <li>• <strong>e<sup>-0.5t</sup>:</strong> Eliminación exponencial</li>
                  <li>• El pico ocurre alrededor de t = 2h</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Integral (AUC):</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Límites:</strong> [{a}, {b}] horas</li>
                  <li>• <strong>AUC = </strong>∫₀¹⁰ 10t·e<sup>-0.5t</sup> dt</li>
                  <li>• <strong>Unidades:</strong> mg·h/L</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="font-semibold text-gray-800 mb-2">Solución Exacta (Analítica):</p>
              <p className="text-center text-2xl font-bold text-green-700">
                AUC = {exacta.toFixed(8)} mg·h/L
              </p>
              <p className="text-center text-xs text-gray-600 mt-2">
                Calculada mediante integración analítica: -40e<sup>-0.5t</sup> - 20t·e<sup>-0.5t</sup>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MÉTODOS NUMÉRICOS */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Calculator className="w-8 h-8 mr-3 text-blue-500" />
          3. Métodos de Integración Numérica
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🟢 TRAPECIO</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-emerald-400 mb-4">
              <p className="text-center text-sm font-bold text-emerald-700 mb-2">
                ∫ f(x)dx ≈ (h/2)[y₀ + yₙ + 2Σyᵢ]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Aproxima el área usando <strong>trapecios</strong>. Simple y rápido, pero menos preciso.
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🟡 SIMPSON 1/3</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-yellow-400 mb-4">
              <p className="text-center text-sm font-bold text-yellow-700 mb-2">
                ∫ f(x)dx ≈ (h/3)[y₀ + yₙ + 4Σimpares + 2Σpares]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa <strong>parábolas de 2° grado</strong>. Mayor precisión. <strong>Requiere n par</strong>.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔵 SIMPSON 3/8</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-cyan-400 mb-4">
              <p className="text-center text-sm font-bold text-cyan-700 mb-2">
                ∫ f(x)dx ≈ (3h/8)[y₀ + yₙ + 3Σ + 2Σ]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa <strong>parábolas de 3° grado</strong>. Máxima precisión. <strong>Requiere n múltiplo de 3</strong>.
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📉 Límite Inferior a (horas)
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Límite Superior b (horas)
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔢 Número de Subintervalos (n)
            </label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Simpson 1/3: n par | Simpson 3/8: n múltiplo de 3
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Método a usar
            </label>
            <select
              value={metodoSeleccionado}
              onChange={(e) => setMetodoSeleccionado(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="trapecio">Trapecio</option>
              <option value="simpson13">Simpson 1/3</option>
              <option value="simpson38">Simpson 3/8</option>
              <option value="todos">Comparar Todos</option>
            </select>
          </div>
        </div>

        {/* Advertencias sobre n */}
        {metodoSeleccionado !== 'trapecio' && (
          <div className="mb-4 space-y-2">
            {metodoSeleccionado === 'simpson13' && !nEsPar && (
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-700">
                  ⚠️ <strong>Simpson 1/3 requiere n PAR.</strong> Actual n = {n}. Prueba con: 2, 4, 6, 8, 10, 12...
                </p>
              </div>
            )}
            
            {metodoSeleccionado === 'simpson38' && !nEsMultiplo3 && (
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-700">
                  ⚠️ <strong>Simpson 3/8 requiere n MÚLTIPLO DE 3.</strong> Actual n = {n}. Prueba con: 3, 6, 9, 12, 15...
                </p>
              </div>
            )}

            {metodoSeleccionado === 'todos' && (!nEsPar || !nEsMultiplo3) && (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  ℹ️ Con n = {n}:
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Trapecio: Siempre disponible</li>
                  <li>{nEsPar ? '✓' : '✗'} Simpson 1/3: {nEsPar ? 'Disponible' : 'No disponible (n debe ser par)'}</li>
                  <li>{nEsMultiplo3 ? '✓' : '✗'} Simpson 3/8: {nEsMultiplo3 ? 'Disponible' : 'No disponible (n debe ser múltiplo de 3)'}</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Sugerencia: Usa n = 6, 12, 18, 24... para calcular todos los métodos
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300 mb-4">
          <p className="text-sm text-gray-700">
            <strong>💡 Nota:</strong> h = (b - a) / n = ({b} - {a}) / {n} = {((b - a) / n).toFixed(4)} horas
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Calcular AUC
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
          {/* TRAPECIO */}
          {resultsTrapecio && resultsTrapecio.aproximacion && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-emerald-300 mb-8">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🟢 REGLA DEL TRAPECIO</h2>
                <p className="text-sm mt-1">∫₀¹⁰ 10t·e<sup>-0.5t</sup> dt</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-emerald-100">
                      <th className="border-2 border-emerald-300 px-3 py-3">#</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">x</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">y</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsTrapecio.results.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-emerald-50' : 'bg-white'}>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center font-semibold bg-emerald-100">{row.i}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center">{row.x.toFixed(4)}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center font-mono">{row.y.toFixed(8)}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center">{row.h.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-emerald-50 rounded-lg p-4 border border-emerald-300">
                <p className="font-semibold text-gray-800 mb-2">Aproximación (Trapecio):</p>
                <p className="text-3xl font-bold text-emerald-600">
                  AUC ≈ {resultsTrapecio.aproximacion.toFixed(8)} mg·h/L
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Error absoluto: {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(8)}
                </p>
                <p className="text-sm text-gray-600">
                  Error relativo: {((Math.abs(resultsTrapecio.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
                </p>
              </div>
            </div>
          )}

          {/* SIMPSON 1/3 */}
          {resultsSimpson13 && resultsSimpson13.aproximacion && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-300 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🟡 SIMPSON 1/3</h2>
                <p className="text-sm mt-1">∫₀¹⁰ 10t·e<sup>-0.5t</sup> dt</p>
                <p className="text-xs mt-2 bg-orange-600 bg-opacity-50 rounded px-2 py-1 inline-block">
                  Utilizando # de pasos PAR
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="border-2 border-yellow-300 px-3 py-3">#</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">x</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">y</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">h</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsSimpson13.results.map((row, index) => {
                      let tipo = '';
                      let bgColor = 'bg-white';
                      if (index === 0 || index === resultsSimpson13.results.length - 1) {
                        tipo = 'Extremo';
                        bgColor = 'bg-yellow-50';
                      } else if (index % 2 !== 0) {
                        tipo = 'Impar (×4)';
                        bgColor = 'bg-orange-50';
                      } else {
                        tipo = 'Par (×2)';
                        bgColor = 'bg-yellow-50';
                      }
                      
                      return (
                        <tr key={index} className={bgColor}>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center font-semibold bg-yellow-100">{row.i}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center">{row.x.toFixed(4)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center font-mono">{row.y.toFixed(8)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center">{row.h.toFixed(4)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center text-xs">{tipo}</td>
                        </tr>
                      );
                      })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
            <p className="font-semibold text-gray-800 mb-2">Aproximación (Simpson 1/3):</p>
            <p className="text-3xl font-bold text-yellow-600">
              AUC ≈ {resultsSimpson13.aproximacion.toFixed(8)} mg·h/L
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Error absoluto: {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(8)}
            </p>
            <p className="text-sm text-gray-600">
              Error relativo: {((Math.abs(resultsSimpson13.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
            </p>
          </div>
        </div>
      )}

      {/* SIMPSON 3/8 */}
      {resultsSimpson38 && resultsSimpson38.aproximacion && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-cyan-300 mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold">🔵 SIMPSON 3/8</h2>
            <p className="text-sm mt-1">∫₀¹⁰ 10t·e<sup>-0.5t</sup> dt</p>
            <p className="text-xs mt-2 bg-blue-600 bg-opacity-50 rounded px-2 py-1 inline-block">
              Utilizando # de pasos MÚLTIPLO DE 3
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-cyan-100">
                  <th className="border-2 border-cyan-300 px-3 py-3">#</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">x</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">y</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">h</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {resultsSimpson38.results.map((row, index) => {
                  let tipo = '';
                  let bgColor = 'bg-white';
                  if (index === 0 || index === resultsSimpson38.results.length - 1) {
                    tipo = 'Extremo';
                    bgColor = 'bg-cyan-50';
                  } else if (index % 3 === 0) {
                    tipo = 'Múltiplo 3 (×2)';
                    bgColor = 'bg-blue-50';
                  } else {
                    tipo = 'Resto (×3)';
                    bgColor = 'bg-cyan-50';
                  }
                  
                  return (
                    <tr key={index} className={bgColor}>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center font-semibold bg-cyan-100">{row.i}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center">{row.x.toFixed(4)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center font-mono">{row.y.toFixed(8)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center">{row.h.toFixed(4)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center text-xs">{tipo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-cyan-50 rounded-lg p-4 border border-cyan-300">
            <p className="font-semibold text-gray-800 mb-2">Aproximación (Simpson 3/8):</p>
            <p className="text-3xl font-bold text-cyan-600">
              AUC ≈ {resultsSimpson38.aproximacion.toFixed(8)} mg·h/L
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Error absoluto: {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(8)}
            </p>
            <p className="text-sm text-gray-600">
              Error relativo: {((Math.abs(resultsSimpson38.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
            </p>
          </div>
        </div>
      )}

      {/* COMPARACIÓN */}
      {metodoSeleccionado === 'todos' && resultsTrapecio && resultsSimpson13 && resultsSimpson38 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📊 Comparación de Métodos
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border-2 border-emerald-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-emerald-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">T</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Trapecio</p>
                  <p className="text-xs text-gray-500">Aproximación lineal</p>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-gray-600 mb-2">AUC:</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {resultsTrapecio.aproximacion.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(8)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-yellow-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">S₁</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Simpson 1/3</p>
                  <p className="text-xs text-gray-500">Parábola 2° grado</p>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-600 mb-2">AUC:</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {resultsSimpson13.aproximacion.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(8)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-cyan-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-cyan-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">S₃</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Simpson 3/8</p>
                  <p className="text-xs text-gray-500">Parábola 3° grado</p>
                </div>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-gray-600 mb-2">AUC:</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {resultsSimpson38.aproximacion.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(8)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-400 shadow-md mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">✓</span>
              <div>
                <p className="text-lg font-semibold text-gray-700">Solución Exacta</p>
                <p className="text-xs text-gray-500">Integración analítica</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-3xl font-bold text-green-600">
                {exacta.toFixed(8)} mg·h/L
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">📈 Análisis:</h4>
            {(() => {
              const errores = [
                { metodo: 'Trapecio', error: Math.abs(resultsTrapecio.aproximacion - exacta) },
                { metodo: 'Simpson 1/3', error: Math.abs(resultsSimpson13.aproximacion - exacta) },
                { metodo: 'Simpson 3/8', error: Math.abs(resultsSimpson38.aproximacion - exacta) }
              ];
              const mejor = errores.reduce((prev, curr) => prev.error < curr.error ? prev : curr);
              
              return (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ <strong>{mejor.metodo}</strong> es el más preciso (error: {mejor.error.toFixed(8)})</li>
                    <li>✓ AUC exacta = {exacta.toFixed(6)} mg·h/L</li>
                    <li>✓ Con n = {n}, todos convergen hacia el valor real</li>
                  </ul>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Interpretación Clínica */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-300 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">💊 Interpretación Clínica</h3>
        <div className="space-y-3 text-gray-700">
          <p>
            📊 El AUC de <strong className="text-pink-600 text-xl">{exacta.toFixed(2)} mg·h/L</strong> 
            representa la exposición total del paciente al fármaco.
          </p>
          <p>
            💉 La concentración máxima ocurre alrededor de t = 2 horas.
          </p>
          <p>
            🎯 Los métodos numéricos son esenciales cuando trabajamos con datos experimentales discretos.
          </p>
        </div>
      </div>
    </>
  )}
</div>
);
};
export default Farmaco;