import React, { useState } from 'react';
import { ArrowLeft, Calculator, Radio, BookOpen, Waves } from 'lucide-react';

const Señal = ({ onBack }) => {
  // Estados para los inputs
  const [a, setA] = useState(0); // Límite inferior (segundos)
  const [b, setB] = useState(1); // Límite superior (segundos) - 1 período completo
  const [n, setN] = useState(12); // Número de subintervalos
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('todos');

  // Estados para resultados
  const [resultsTrapecio, setResultsTrapecio] = useState([]);
  const [resultsSimpson13, setResultsSimpson13] = useState([]);
  const [resultsSimpson38, setResultsSimpson38] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Función de señal: S(t) = 5cos(2πt) + 3
  const f = (t) => {
    return 5 * Math.cos(2 * Math.PI * t) + 3;
  };

  // Solución exacta (integral analítica)
  // ∫ (5cos(2πt) + 3) dt = (5/(2π))sin(2πt) + 3t
  const solucionExacta = () => {
    const evaluar = (t) => (5 / (2 * Math.PI)) * Math.sin(2 * Math.PI * t) + 3 * t;
    return evaluar(b) - evaluar(a);
  };

  // MÉTODO DEL TRAPECIO
  const calculateTrapecio = () => {
    const h = (b - a) / n;
    const results = [];
    
    // Generar puntos
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      
      results.push({
        i: i,
        x: x,
        y: y,
        h: h
      });
    }
    
    // Calcular aproximación
    let suma = results[0].y + results[n].y;
    for (let i = 1; i < n; i++) {
      suma += 2 * results[i].y;
    }
    const aproximacion = (h / 2) * suma;
    
    return { results, aproximacion };
  };

  // MÉTODO DE SIMPSON 1/3
  const calculateSimpson13 = () => {
    // Verificar que n sea par
    if (n % 2 !== 0) {
      alert('⚠️ Para Simpson 1/3, el número de subintervalos (n) debe ser PAR.\n\nPor favor ajusta n a un valor par (2, 4, 6, 8, 10, 12, ...)');
      return { results: [], aproximacion: null };
    }
    
    const h = (b - a) / n;
    const results = [];
    
    // Generar puntos
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      
      results.push({
        i: i,
        x: x,
        y: y,
        h: h
      });
    }
    
    // Calcular aproximación
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

  // MÉTODO DE SIMPSON 3/8
  const calculateSimpson38 = () => {
    // Verificar que n sea múltiplo de 3
    if (n % 3 !== 0) {
      alert('⚠️ Para Simpson 3/8, el número de subintervalos (n) debe ser MÚLTIPLO DE 3.\n\nPor favor ajusta n a: 3, 6, 9, 12, 15, ...');
      return { results: [], aproximacion: null };
    }
    
    const h = (b - a) / n;
    const results = [];
    
    // Generar puntos
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      const y = f(x);
      
      results.push({
        i: i,
        x: x,
        y: y,
        h: h
      });
    }
    
    // Calcular aproximación
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
    if (metodoSeleccionado === 'trapecio' || metodoSeleccionado === 'todos') {
      const { results, aproximacion } = calculateTrapecio();
      setResultsTrapecio({ results, aproximacion });
    }

    if (metodoSeleccionado === 'simpson13' || metodoSeleccionado === 'todos') {
      const { results, aproximacion } = calculateSimpson13();
      if (results.length > 0) {
        setResultsSimpson13({ results, aproximacion });
      }
    }

    if (metodoSeleccionado === 'simpson38' || metodoSeleccionado === 'todos') {
      const { results, aproximacion } = calculateSimpson38();
      if (results.length > 0) {
        setResultsSimpson38({ results, aproximacion });
      }
    }

    setShowResults(true);
  };

  const handleReset = () => {
    setA(0);
    setB(1);
    setN(12);
    setMetodoSeleccionado('todos');
    setShowResults(false);
    setResultsTrapecio([]);
    setResultsSimpson13([]);
    setResultsSimpson38([]);
  };

  const exacta = solucionExacta();
  const frecuencia = 1; // Hz (1 ciclo por segundo)
  const periodo = 1 / frecuencia; // 1 segundo

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
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Radio className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Señal de Radio Acumulada</h1>
            <p className="text-violet-100 mt-2">Métodos: Trapecio, Simpson 1/3 y Simpson 3/8</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-violet-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Waves className="w-8 h-8 mr-3 text-violet-500" />
          1. Descripción del Problema
        </h2>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6 border-l-4 border-violet-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Una <strong>señal de radio</strong> transmite información con una amplitud que varía 
              periódicamente en el tiempo. La señal tiene un componente <strong>sinusoidal</strong> (oscilante) 
              más un nivel <strong>DC constante</strong>. Para analizar la energía total transmitida, 
              necesitamos calcular el <strong>área bajo la curva</strong> de la señal en un período completo.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-violet-200">
                <div className="text-3xl mb-2">📻</div>
                <p className="text-sm font-semibold text-gray-700">Frecuencia</p>
                <p className="text-2xl font-bold text-violet-600">{frecuencia} Hz</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-violet-200">
                <div className="text-3xl mb-2">⏱️</div>
                <p className="text-sm font-semibold text-gray-700">Período</p>
                <p className="text-2xl font-bold text-purple-600">{periodo} s</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-violet-200">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm font-semibold text-gray-700">Amplitud</p>
                <p className="text-lg text-gray-600">5cos(2πt) + 3</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">📡 Aplicaciones en Telecomunicaciones:</h3>
            <ul className="space-y-2 text-gray-700 grid md:grid-cols-2 gap-2">
              <li>📻 Análisis de señales de radio AM/FM</li>
              <li>📺 Transmisión de TV y video</li>
              <li>📱 Comunicaciones móviles (4G/5G)</li>
              <li>🛰️ Telemetría satelital</li>
              <li>📡 Radar y sonar</li>
              <li>🔊 Procesamiento de audio</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ECUACIÓN */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Función de Señal
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Señal Periódica</h3>
            <p className="text-gray-700 mb-4">
              La amplitud de la señal varía con el tiempo según:
            </p>

            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-3xl font-bold text-purple-700 mb-3">
                S(t) = 5cos(2πt) + 3
              </p>
              <p className="text-center text-sm text-gray-600">
                Amplitud de la señal (unidades arbitrarias) en función del tiempo t (segundos)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Componentes:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>5cos(2πt):</strong> Componente AC (oscilante)</li>
                  <li>• <strong>+3:</strong> Componente DC (nivel base)</li>
                  <li>• Amplitud varía entre -2 y 8</li>
                  <li>• Valor medio: 3 unidades</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Integral (Energía):</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Límites:</strong> [{a}, {b}] segundos</li>
                  <li>• <strong>∫</strong> = ∫₀¹ (5cos(2πt) + 3) dt</li>
                  <li>• <strong>Período:</strong> T = 1 segundo</li>
                  <li>• <strong>Frecuencia:</strong> f = 1 Hz</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="font-semibold text-gray-800 mb-2">Solución Exacta (Analítica):</p>
              <p className="text-center text-2xl font-bold text-green-700">
                Energía = {exacta.toFixed(8)} unidades
              </p>
              <p className="text-center text-xs text-gray-600 mt-2">
                Calculada mediante: (5/(2π))sin(2πt) + 3t evaluada en [{a}, {b}]
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
          {/* TRAPECIO */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🟢 TRAPECIO</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-emerald-400 mb-4">
              <p className="text-center text-sm font-bold text-emerald-700 mb-2">
                ∫ S(t)dt ≈ (h/2)[S₀ + Sₙ + 2ΣSᵢ]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Aproxima el área usando <strong>trapecios</strong>. Bueno para señales aproximadamente lineales.
            </p>
          </div>

          {/* SIMPSON 1/3 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🟡 SIMPSON 1/3</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-yellow-400 mb-4">
              <p className="text-center text-sm font-bold text-yellow-700 mb-2">
                ∫ S(t)dt ≈ (h/3)[S₀ + Sₙ + 4Σimpares + 2Σpares]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa <strong>parábolas de 2° grado</strong>. Excelente para señales sinusoidales. <strong>n par</strong>.
            </p>
          </div>

          {/* SIMPSON 3/8 */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔵 SIMPSON 3/8</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-cyan-400 mb-4">
              <p className="text-center text-sm font-bold text-cyan-700 mb-2">
                ∫ S(t)dt ≈ (3h/8)[S₀ + Sₙ + 3Σ + 2Σ]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa <strong>parábolas de 3° grado</strong>. Mayor precisión. <strong>n múltiplo de 3</strong>.
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
              📉 Límite Inferior a (s)
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Límite Superior b (s)
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
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
              S1/3: n par | S3/8: n múltiplo de 3
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Método a usar
            </label>
            <select
              value={metodoSeleccionado}
              onChange={(e) => setMetodoSeleccionado(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-violet-100 to-purple-100"
            >
              <option value="trapecio">Trapecio</option>
              <option value="simpson13">Simpson 1/3</option>
              <option value="simpson38">Simpson 3/8</option>
              <option value="todos">Comparar Todos</option>
            </select>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300 mb-4">
          <p className="text-sm text-gray-700">
            <strong>💡 Nota:</strong> h = (b - a) / n = ({b} - {a}) / {n} = {((b - a) / n).toFixed(6)} segundos
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <strong>📡 Período:</strong> T = {periodo} s | <strong>Frecuencia:</strong> f = {frecuencia} Hz
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Calcular Energía
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
          {/* Tabla TRAPECIO */}
          {(metodoSeleccionado === 'trapecio' || metodoSeleccionado === 'todos') && resultsTrapecio.results && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-emerald-300 mb-8">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🟢 REGLA DEL TRAPECIO</h2>
                <p className="text-sm mt-1">∫₀¹ (5cos(2πt) + 3) dt</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-emerald-100">
                      <th className="border-2 border-emerald-300 px-3 py-3">#</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">t (s)</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">S(t) = 5cos(2πt) + 3</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsTrapecio.results.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-emerald-50' : 'bg-white'}>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center font-semibold bg-emerald-100">{row.i}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center">{row.x.toFixed(6)}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center font-mono font-bold">{row.y.toFixed(8)}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center">{row.h.toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-emerald-50 rounded-lg p-4 border border-emerald-300">
                <p className="font-semibold text-gray-800 mb-2">Aproximación (Trapecio):</p>
                <p className="text-3xl font-bold text-emerald-600">
                  Energía ≈ {resultsTrapecio.aproximacion.toFixed(8)} unidades
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Error absoluto: |{resultsTrapecio.aproximacion.toFixed(8)} - {exacta.toFixed(8)}| = {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(8)}
                </p>
                <p className="text-sm text-gray-600">
                  Error relativo: {((Math.abs(resultsTrapecio.aproximacion - exacta) / Math.abs(exacta)) * 100).toFixed(4)}%
                </p>
              </div>
            </div>
          )}

          {/* Tabla SIMPSON 1/3 */}
          {(metodoSeleccionado === 'simpson13' || metodoSeleccionado === 'todos') && resultsSimpson13.results && resultsSimpson13.results.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-300 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🟡 SIMPSON 1/3</h2>
                <p className="text-sm mt-1">∫₀¹ (5cos(2πt) + 3) dt</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="border-2 border-yellow-300 px-3 py-3">#</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">t (s)</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">S(t) = 5cos(2πt) + 3</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">h</th>
                      <th className="border-2 border-yellow-300 px-3 py-3 bg-orange-50">Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsSimpson13.results.map((row, index) => {
                      let tipo = '';
                      if (index === 0 || index === resultsSimpson13.results.length - 1) {
                        tipo = 'Extremo';
                      } else if (index % 2 !== 0) {
                        tipo = 'Impar (×4)';
                      } else {
                        tipo = 'Par (×2)';
                      }
                      
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center font-semibold bg-yellow-100">{row.i}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center">{row.x.toFixed(6)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center font-mono font-bold">{row.y.toFixed(8)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center">{row.h.toFixed(6)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center bg-orange-50 text-xs font-semibold">{tipo}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="font-semibold text-gray-800 mb-2">Aproximación (Simpson 1/3):</p>
                <p className="text-3xl font-bold text-yellow-600">
                  Energía ≈ {resultsSimpson13.aproximacion.toFixed(8)} unidades
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Error absoluto: |{resultsSimpson13.aproximacion.toFixed(8)} - {exacta.toFixed(8)}| = {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(8)}
</p>
<p className="text-sm text-gray-600">
Error relativo: {((Math.abs(resultsSimpson13.aproximacion - exacta) / Math.abs(exacta)) * 100).toFixed(4)}%
</p>
</div>
</div>
)}
      {/* Tabla SIMPSON 3/8 */}
      {(metodoSeleccionado === 'simpson38' || metodoSeleccionado === 'todos') && resultsSimpson38.results && resultsSimpson38.results.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-cyan-300 mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold">🔵 SIMPSON 3/8</h2>
            <p className="text-sm mt-1">∫₀¹ (5cos(2πt) + 3) dt</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-cyan-100">
                  <th className="border-2 border-cyan-300 px-3 py-3">#</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">t (s)</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">S(t) = 5cos(2πt) + 3</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">h</th>
                  <th className="border-2 border-cyan-300 px-3 py-3 bg-blue-50">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {resultsSimpson38.results.map((row, index) => {
                  let tipo = '';
                  if (index === 0 || index === resultsSimpson38.results.length - 1) {
                    tipo = 'Extremo';
                  } else if (index % 3 === 0) {
                    tipo = 'Múltiplo 3 (×2)';
                  } else {
                    tipo = 'Resto (×3)';
                  }
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-cyan-50' : 'bg-white'}>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center font-semibold bg-cyan-100">{row.i}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center">{row.x.toFixed(6)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center font-mono font-bold">{row.y.toFixed(8)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center">{row.h.toFixed(6)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center bg-blue-50 text-xs font-semibold">{tipo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-cyan-50 rounded-lg p-4 border border-cyan-300">
            <p className="font-semibold text-gray-800 mb-2">Aproximación (Simpson 3/8):</p>
            <p className="text-3xl font-bold text-cyan-600">
              Energía ≈ {resultsSimpson38.aproximacion.toFixed(8)} unidades
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Error absoluto: |{resultsSimpson38.aproximacion.toFixed(8)} - {exacta.toFixed(8)}| = {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(8)}
            </p>
            <p className="text-sm text-gray-600">
              Error relativo: {((Math.abs(resultsSimpson38.aproximacion - exacta) / Math.abs(exacta)) * 100).toFixed(4)}%
            </p>
          </div>
        </div>
      )}

      {/* COMPARACIÓN DE MÉTODOS */}
      {metodoSeleccionado === 'todos' && resultsTrapecio.aproximacion && resultsSimpson13.aproximacion && resultsSimpson38.aproximacion && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Comparación de Métodos
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Trapecio */}
            <div className="bg-white rounded-xl p-6 border-2 border-emerald-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-emerald-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">T</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Trapecio</p>
                  <p className="text-xs text-gray-500">Aproximación lineal</p>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-gray-600 mb-2">Energía Aproximada:</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {resultsTrapecio.aproximacion.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(8)}
                </p>
                <p className="text-xs text-gray-500">
                  {((Math.abs(resultsTrapecio.aproximacion - exacta) / Math.abs(exacta)) * 100).toFixed(4)}%
                </p>
              </div>
            </div>

            {/* Simpson 1/3 */}
            <div className="bg-white rounded-xl p-6 border-2 border-yellow-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">S₁</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Simpson 1/3</p>
                  <p className="text-xs text-gray-500">Parábola 2° grado</p>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-600 mb-2">Energía Aproximada:</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {resultsSimpson13.aproximacion.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(8)}
                </p>
                <p className="text-xs text-gray-500">
                  {((Math.abs(resultsSimpson13.aproximacion - exacta) / Math.abs(exacta)) * 100).toFixed(4)}%
                </p>
              </div>
            </div>

            {/* Simpson 3/8 */}
            <div className="bg-white rounded-xl p-6 border-2 border-cyan-300 shadow-md">
              <div className="flex items-center mb-4">
                <span className="bg-cyan-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">S₃</span>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Simpson 3/8</p>
                  <p className="text-xs text-gray-500">Parábola 3° grado</p>
                </div>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-gray-600 mb-2">Energía Aproximada:</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {resultsSimpson38.aproximacion.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(8)}
                </p>
                <p className="text-xs text-gray-500">
                  {((Math.abs(resultsSimpson38.aproximacion - exacta) / Math.abs(exacta)) * 100).toFixed(4)}%
                </p>
              </div>
            </div>
          </div>

          {/* Valor Exacto */}
          <div className="bg-white rounded-xl p-6 border-2 border-green-400 shadow-md mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">✓</span>
              <div>
                <p className="text-lg font-semibold text-gray-700">Solución Exacta (Analítica)</p>
                <p className="text-xs text-gray-500">Integración directa</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Energía Exacta:</p>
              <p className="text-3xl font-bold text-green-600">
                {exacta.toFixed(8)} unidades
              </p>
            </div>
          </div>

          {/* Análisis */}
          <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Análisis de Precisión:</h4>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ERROR TRAPECIO</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(8)}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ERROR SIMPSON 1/3</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(8)}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ERROR SIMPSON 3/8</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(8)}
                </p>
              </div>
            </div>

            {/* Determinar el más preciso */}
            {(() => {
              const errorTrapecio = Math.abs(resultsTrapecio.aproximacion - exacta);
              const errorSimpson13 = Math.abs(resultsSimpson13.aproximacion - exacta);
              const errorSimpson38 = Math.abs(resultsSimpson38.aproximacion - exacta);
              
              let masPreciso = 'Trapecio';
              let menorError = errorTrapecio;
              
              if (errorSimpson13 < menorError) {
                masPreciso = 'Simpson 1/3';
                menorError = errorSimpson13;
              }
              
              if (errorSimpson38 < menorError) {
                masPreciso = 'Simpson 3/8';
                menorError = errorSimpson38;
              }
              
              return (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="font-bold text-gray-800 mb-2">💡 Conclusiones:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ <strong>{masPreciso}</strong> es el método más preciso con error de {menorError.toFixed(8)}</li>
                    <li>✓ Energía exacta = {exacta.toFixed(6)} unidades en 1 período completo</li>
                    <li>✓ Para señales sinusoidales, Simpson 1/3 es especialmente efectivo</li>
                    <li>✓ Con n = {n}, todos los métodos dan buenas aproximaciones</li>
                  </ul>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Interpretación Técnica */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border-2 border-violet-300 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📡 Interpretación Técnica</h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start">
            <span className="text-2xl mr-3">📊</span>
            <span>
              La energía total acumulada de la señal en un período completo es{' '}
              <strong className="text-violet-600 text-xl">
                {exacta.toFixed(4)} unidades
              </strong>, que corresponde al área bajo la curva de la señal.
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">🌊</span>
            <span>
              La señal tiene un <strong>valor medio de 3</strong> (componente DC) y oscila con 
              amplitud de ±5 alrededor de este valor (componente AC sinusoidal).
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">📻</span>
            <span>
              Este tipo de análisis es fundamental en <strong>procesamiento de señales</strong>, 
              donde se estudia el contenido energético y frecuencial de señales periódicas.
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">🎯</span>
            <span>
              Los métodos numéricos son especialmente útiles cuando se trabaja con 
              <strong> señales digitalizadas</strong> o datos experimentales discretos.
            </span>
          </p>
        </div>
      </div>
    </>
  )}
</div>
);
};
export default Señal;