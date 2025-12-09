import React, { useState } from 'react';
import { ArrowLeft, Calculator, Users, BookOpen, TrendingUp } from 'lucide-react';

const Poblacion = ({ onBack }) => {
  // Estados para los inputs de la integral
  const [a, setA] = useState(0); // Límite inferior (años)
  const [b, setB] = useState(10); // Límite superior (años)
  const [n, setN] = useState(10); // Número de subintervalos
  
  // Estados para los parámetros de la función de población
  const [poblacionInicial, setPoblacionInicial] = useState(1000); // Población inicial
  const [tasaCrecimiento, setTasaCrecimiento] = useState(0.1); // Tasa de crecimiento (10%)
  
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('todos');

  // Estados para resultados
  const [resultsTrapecio, setResultsTrapecio] = useState([]);
  const [resultsSimpson13, setResultsSimpson13] = useState([]);
  const [resultsSimpson38, setResultsSimpson38] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Función de población: P(t) = P₀(1 + r·t)²
  const f = (t) => {
    return poblacionInicial * Math.pow(1 + tasaCrecimiento * t, 2);
  };

  // Solución exacta (integral analítica)
  // ∫ P₀(1 + r·t)² dt = P₀ · [(1 + r·t)³ / (3 · r)]
  const solucionExacta = () => {
    const evaluar = (t) => (poblacionInicial / (3 * tasaCrecimiento)) * Math.pow(1 + tasaCrecimiento * t, 3);
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
    setB(10);
    setN(10);
    setPoblacionInicial(1000);
    setTasaCrecimiento(0.1);
    setMetodoSeleccionado('todos');
    setShowResults(false);
    setResultsTrapecio([]);
    setResultsSimpson13([]);
    setResultsSimpson38([]);
  };

  const exacta = solucionExacta();
  const P0 = f(a);
  const Pf = f(b);

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
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Población Creciente Acumulada</h1>
            <p className="text-teal-100 mt-2">Métodos: Trapecio, Simpson 1/3 y Simpson 3/8</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-teal-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-8 h-8 mr-3 text-teal-500" />
          1. Descripción del Problema
        </h2>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-6 border-l-4 border-teal-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Una ciudad experimenta un <strong>crecimiento poblacional cuadrático</strong> modelado por 
              la función <strong>P(t) = {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)²</strong>. 
              Para planificar recursos (agua, energía, infraestructura), 
              necesitamos calcular la <strong>población total acumulada</strong> a lo largo de {b} años, 
              que representa la suma de habitantes en cada momento del período.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-teal-200">
                <div className="text-3xl mb-2">🏙️</div>
                <p className="text-sm font-semibold text-gray-700">Población Inicial P₀</p>
                <p className="text-2xl font-bold text-teal-600">{poblacionInicial} hab</p>
                <p className="text-xs text-gray-500">Año {a}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-teal-200">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-sm font-semibold text-gray-700">Tasa Crecimiento r</p>
                <p className="text-2xl font-bold text-cyan-600">{(tasaCrecimiento * 100).toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Anual</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-teal-200">
                <div className="text-3xl mb-2">🏘️</div>
                <p className="text-sm font-semibold text-gray-700">Población Final</p>
                <p className="text-2xl font-bold text-purple-600">{Pf.toFixed(0)} hab</p>
                <p className="text-xs text-gray-500">Año {b}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-teal-200">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm font-semibold text-gray-700">Crecimiento</p>
                <p className="text-lg font-bold text-green-600">
                  {(((Pf - P0) / P0) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">En {b} años</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🏛️ Aplicaciones en Planificación:</h3>
            <ul className="space-y-2 text-gray-700 grid md:grid-cols-2 gap-2">
              <li className="flex items-center">🏗️ <span className="ml-2">Planificación urbana y vivienda</span></li>
              <li className="flex items-center">💧 <span className="ml-2">Gestión de recursos hídricos</span></li>
              <li className="flex items-center">⚡ <span className="ml-2">Infraestructura energética</span></li>
              <li className="flex items-center">🏥 <span className="ml-2">Servicios de salud pública</span></li>
              <li className="flex items-center">🎓 <span className="ml-2">Sistema educativo</span></li>
              <li className="flex items-center">🚇 <span className="ml-2">Transporte público</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ECUACIÓN */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Modelo de Crecimiento Poblacional
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Crecimiento Cuadrático</h3>
            <p className="text-gray-700 mb-4">
              La población de la ciudad crece de forma <strong>no lineal</strong> según:
            </p>

            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-2xl font-bold text-purple-700 mb-3">
                P(t) = {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)²
              </p>
              <p className="text-center text-sm text-gray-600">
                Población (habitantes) en función del tiempo t (años)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Parámetros Personalizables:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>P₀ = {poblacionInicial}:</strong> Población inicial</li>
                  <li>• <strong>r = {tasaCrecimiento.toFixed(2)}:</strong> Tasa de crecimiento ({(tasaCrecimiento * 100).toFixed(1)}%)</li>
                  <li>• <strong>(1 + {tasaCrecimiento.toFixed(2)}·t)²:</strong> Factor cuadrático</li>
                  <li>• Expansión: {poblacionInicial}(1 + {(2*tasaCrecimiento).toFixed(2)}t + {(tasaCrecimiento*tasaCrecimiento).toFixed(4)}t²)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Integral (Acumulada):</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Límites:</strong> [{a}, {b}] años</li>
                  <li>• <strong>∫ P(t)dt</strong> = ∫<sub>{a}</sub><sup>{b}</sup> {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}t)² dt</li>
                  <li>• <strong>Unidades:</strong> habitantes·años</li>
                  <li>• Representa carga demográfica total</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="font-semibold text-gray-800 mb-2">Solución Exacta (Analítica):</p>
              <p className="text-center text-xl font-bold text-green-700 mb-2">
                ∫ P(t)dt = [P₀/(3r)]·(1 + r·t)³ evaluada en [{a}, {b}]
              </p>
              <p className="text-center text-2xl font-bold text-green-800 mt-3">
                Población Acumulada = {exacta.toFixed(2)} hab·años
              </p>
              <p className="text-center text-xs text-gray-600 mt-2">
                Fórmula: ({poblacionInicial}/(3×{tasaCrecimiento.toFixed(2)}))·(1 + {tasaCrecimiento.toFixed(2)}·t)³
              </p>
            </div>
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
              📉 Año Inicial a
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Año Final b
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏙️ Población Inicial P₀
            </label>
            <input
              type="number"
              value={poblacionInicial}
              onChange={(e) => setPoblacionInicial(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Habitantes en t = {a} años
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Tasa Crecimiento r
            </label>
            <input
              type="number"
              step="0.01"
              value={tasaCrecimiento}
              onChange={(e) => setTasaCrecimiento(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ej: 0.1 = 10% anual
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔢 Número de Subintervalos (n)
            </label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-teal-100 to-cyan-100"
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
            <strong>💡 Parámetros Actuales:</strong> P(t) = {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)²
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <strong>📏 Intervalo:</strong> h = (b - a) / n = ({b} - {a}) / {n} = {((b - a) / n).toFixed(4)} años
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <strong>👥 Población:</strong> P({a}) = {P0.toFixed(0)} hab | P({b}) = {Pf.toFixed(0)} hab 
            (Crecimiento: {(((Pf - P0) / P0) * 100).toFixed(1)}%)
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Calcular Población Acumulada
          </button>
          <button
            onClick={handleReset}
            className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
          >
            Limpiar
          </button>
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
                ∫ P(t)dt ≈ (h/2)[P₀ + Pₙ + 2ΣPᵢ]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Aproxima el área usando <strong>trapecios</strong>. Útil para estimaciones rápidas.
            </p>
          </div>

          {/* SIMPSON 1/3 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🟡 SIMPSON 1/3</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-yellow-400 mb-4">
              <p className="text-center text-sm font-bold text-yellow-700 mb-2">
                ∫ P(t)dt ≈ (h/3)[P₀ + Pₙ + 4Σimpares + 2Σpares]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa <strong>parábolas de 2° grado</strong>. Ideal para curvas cuadráticas. <strong>n par</strong>.
            </p>
          </div>

          {/* SIMPSON 3/8 */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔵 SIMPSON 3/8</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-cyan-400 mb-4">
              <p className="text-center text-sm font-bold text-cyan-700 mb-2">
                ∫ P(t)dt ≈ (3h/8)[P₀ + Pₙ + 3Σ + 2Σ]
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Usa <strong>parábolas de 3° grado</strong>. Alta precisión. <strong>n múltiplo de 3</strong>.
            </p>
          </div>
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
                <p className="text-sm mt-1">∫<sub>{a}</sub><sup>{b}</sup> {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)² dt</p>
                <p className="text-xs mt-1">n = {n} | h = {((b - a) / n).toFixed(4)} años</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-emerald-100">
                      <th className="border-2 border-emerald-300 px-3 py-3">#</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">t (años)</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">P(t) = {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)²<br/>(habitantes)</th>
                      <th className="border-2 border-emerald-300 px-3 py-3">h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsTrapecio.results.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-emerald-50' : 'bg-white'}>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center font-semibold bg-emerald-100">{row.i}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center">{row.x.toFixed(2)}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center font-mono font-bold">{row.y.toFixed(2)}</td>
                        <td className="border-2 border-emerald-200 px-3 py-2 text-center">{row.h.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-emerald-50 rounded-lg p-4 border border-emerald-300">
                <p className="font-semibold text-gray-800 mb-2">Aproximación (Trapecio):</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {resultsTrapecio.aproximacion.toFixed(2)} hab·años
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Error absoluto: |{resultsTrapecio.aproximacion.toFixed(2)} - {exacta.toFixed(2)}| = {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Error relativo: {((Math.abs(resultsTrapecio.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
                </p>
              </div>
            </div>
          )}

          {/* Tabla SIMPSON 1/3 */}
          {(metodoSeleccionado === 'simpson13' || metodoSeleccionado === 'todos') && resultsSimpson13.results && resultsSimpson13.results.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-300 mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🟡 SIMPSON 1/3</h2>
                <p className="text-sm mt-1">∫<sub>{a}</sub><sup>{b}</sup> {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)² dt</p>
                <p className="text-xs mt-1">n = {n} (par) | h = {((b - a) / n).toFixed(4)} años</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="border-2 border-yellow-300 px-3 py-3">#</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">t (años)</th>
                      <th className="border-2 border-yellow-300 px-3 py-3">P(t) = {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)²<br/>(habitantes)</th>
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
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center">{row.x.toFixed(2)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center font-mono font-bold">{row.y.toFixed(2)}</td>
                          <td className="border-2 border-yellow-200 px-3 py-2 text-center">{row.h.toFixed(2)}</td>
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
              {resultsSimpson13.aproximacion.toFixed(2)} hab·años
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Error absoluto: |{resultsSimpson13.aproximacion.toFixed(2)} - {exacta.toFixed(2)}| = {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Error relativo: {((Math.abs(resultsSimpson13.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
            </p>
          </div>
        </div>
      )}

      {/* Tabla SIMPSON 3/8 */}
      {(metodoSeleccionado === 'simpson38' || metodoSeleccionado === 'todos') && resultsSimpson38.results && resultsSimpson38.results.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-cyan-300 mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold">🔵 SIMPSON 3/8</h2>
            <p className="text-sm mt-1">∫<sub>{a}</sub><sup>{b}</sup> {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)² dt</p>
            <p className="text-xs mt-1">n = {n} (múltiplo de 3) | h = {((b - a) / n).toFixed(4)} años</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-cyan-100">
                  <th className="border-2 border-cyan-300 px-3 py-3">#</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">t (años)</th>
                  <th className="border-2 border-cyan-300 px-3 py-3">P(t) = {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}·t)²<br/>(habitantes)</th>
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
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center">{row.x.toFixed(2)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center font-mono font-bold">{row.y.toFixed(2)}</td>
                      <td className="border-2 border-cyan-200 px-3 py-2 text-center">{row.h.toFixed(2)}</td>
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
              {resultsSimpson38.aproximacion.toFixed(2)} hab·años
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Error absoluto: |{resultsSimpson38.aproximacion.toFixed(2)} - {exacta.toFixed(2)}| = {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Error relativo: {((Math.abs(resultsSimpson38.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
            </p>
          </div>
        </div>
      )}

      {/* COMPARACIÓN DE MÉTODOS */}
      {metodoSeleccionado === 'todos' && resultsTrapecio.aproximacion && resultsSimpson13.aproximacion && resultsSimpson38.aproximacion && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-300 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📊 Comparación de Métodos
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
                <p className="text-sm text-gray-600 mb-2">Población Acumulada:</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {resultsTrapecio.aproximacion.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {((Math.abs(resultsTrapecio.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
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
                <p className="text-sm text-gray-600 mb-2">Población Acumulada:</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {resultsSimpson13.aproximacion.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {((Math.abs(resultsSimpson13.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
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
                <p className="text-sm text-gray-600 mb-2">Población Acumulada:</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {resultsSimpson38.aproximacion.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Error: {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {((Math.abs(resultsSimpson38.aproximacion - exacta) / exacta) * 100).toFixed(4)}%
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
              <p className="text-sm text-gray-600 mb-2">Población Acumulada Exacta:</p>
              <p className="text-3xl font-bold text-green-600">
                {exacta.toFixed(2)} hab·años
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Fórmula: P₀/(3r)·[(1 + r·b)³ - (1 + r·a)³]
              </p>
            </div>
          </div>

          {/* Análisis */}
          <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
            <h4 className="text-xl font-bold text-gray-800 mb-4">📈 Análisis de Precisión:</h4>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ERROR TRAPECIO</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {Math.abs(resultsTrapecio.aproximacion - exacta).toFixed(2)}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ERROR SIMPSON 1/3</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.abs(resultsSimpson13.aproximacion - exacta).toFixed(2)}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">ERROR SIMPSON 3/8</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {Math.abs(resultsSimpson38.aproximacion - exacta).toFixed(2)}
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
                    <li>✓ <strong>{masPreciso}</strong> es el método más preciso con error de {menorError.toFixed(2)} hab·años</li>
                    <li>✓ Población acumulada exacta = {exacta.toFixed(2)} hab·años</li>
                    <li>✓ Para funciones cuadráticas, Simpson 1/3 debería ser exacto teóricamente</li>
                    <li>✓ Población creció de {P0.toFixed(0)} a {Pf.toFixed(0)} hab en {b} años ({(((Pf - P0) / P0) * 100).toFixed(1)}%)</li>
                    <li>✓ Función: P(t) = {poblacionInicial}(1 + {tasaCrecimiento.toFixed(2)}t)²</li>
                  </ul>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Interpretación Demográfica */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-300 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">👥 Interpretación Demográfica</h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start">
            <span className="text-2xl mr-3">📊</span>
            <span>
              La población acumulada de{' '}
              <strong className="text-teal-600 text-xl">
                {exacta.toFixed(0)} hab·años
              </strong>{' '}
              representa la carga demográfica total que la ciudad debe atender durante {b} años.
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">📈</span>
            <span>
              La población creció de <strong>{P0.toFixed(0)} habitantes</strong> (año {a}) 
              a <strong>{Pf.toFixed(0)} habitantes</strong> (año {b}), 
              un aumento del <strong>{(((Pf - P0) / P0) * 100).toFixed(1)}%</strong>.
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">🏗️</span>
            <span>
              Esta información es crucial para <strong>planificar infraestructura</strong> (escuelas, hospitales, viviendas) 
              y <strong>gestionar recursos</strong> (agua, energía, transporte) de manera eficiente.
            </span>
          </p>

          <p className="flex items-start">
            <span className="text-2xl mr-3">🎯</span>
            <span>
              Los métodos numéricos permiten calcular estos valores incluso cuando no existe 
              una fórmula exacta o cuando se trabaja con <strong>datos censales discretos</strong>.
            </span>
          </p>
        </div>
      </div>
    </>
  )}
</div>
);
};
export default Poblacion;