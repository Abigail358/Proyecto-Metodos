import React, { useState } from 'react';
import { ArrowLeft, Calculator, TrendingUp, DollarSign, PiggyBank, BookOpen, LineChart } from 'lucide-react';

const Finanzas = ({ onBack }) => {
  // Estados para los inputs
  const [P0, setP0] = useState(1000); // Capital inicial ($)
  const [r, setR] = useState(0.08); // Tasa de interés anual (8% = 0.08)
  const [D, setD] = useState(100); // Depósito mensual ($)
  const [years, setYears] = useState(10); // Años
  const [h, setH] = useState(1/12); // Tamaño de paso (1/12 = mensual)
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('ambos');

  // Estados para resultados
  const [resultsEuler, setResultsEuler] = useState([]);
  const [resultsHeun, setResultsHeun] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Convertir años a meses para cálculo
  const tFinal = years;

  // Función dP/dt = r*P + D (con depósitos continuos)
  // Convertimos depósito mensual a tasa continua
  const deposito_continuo = D * 12; // Anualizar el depósito mensual
  
  const f = (t, P) => {
    return r * P + deposito_continuo;
  };

  // Solución analítica exacta: P(t) = (P0 + D/r)e^(rt) - D/r
  const solucionExacta = (t) => {
    if (r === 0) return P0 + deposito_continuo * t;
    return (P0 + deposito_continuo / r) * Math.exp(r * t) - deposito_continuo / r;
  };

  // Método de Euler
  const calculateEuler = () => {
    const results = [];
    let t = 0;
    let P = P0;
    const steps = Math.floor(tFinal / h);

    for (let i = 0; i <= steps; i++) {
      const ft = f(t, P);
      const Pexacta = solucionExacta(t);
      const error = Math.abs(P - Pexacta);
      
      results.push({
        iteration: i,
        t: t,
        P: P,
        h: h,
        ft: ft,
        Pexacta: Pexacta,
        error: error,
        intereses: P - P0 - (deposito_continuo * t),
        formula: i === 0 ? `P(0) = $${P0}` : `P${i} = P${i-1} + h·f(t${i-1},P${i-1})`
      });
      
      if (i < steps) {
        P = P + h * ft;
        t = t + h;
      }
    }

    return results;
  };

  // Método de Heun
  const calculateHeun = () => {
    const results = [];
    let t = 0;
    let P = P0;
    const steps = Math.floor(tFinal / h);

    for (let i = 0; i <= steps; i++) {
      const Pexacta = solucionExacta(t);
      const error = Math.abs(P - Pexacta);
      
      if (i === 0) {
        results.push({
          iteration: 0,
          t: t,
          P: P,
          h: h,
          k1: '-',
          tnh: '-',
          hk1: '-',
          Phk1: '-',
          k2: '-',
          Pexacta: Pexacta,
          error: error,
          intereses: 0,
          formula: `P(0) = $${P0}`
        });
      } else {
        const k1 = f(t, P);
        const tnh = t + h;
        const hk1 = h * k1;
        const Phk1 = P + hk1;
        const k2 = f(tnh, Phk1);
        const Pnext = P + (h / 2) * (k1 + k2);
        
        t = tnh;
        
        results.push({
          iteration: i,
          t: t,
          P: Pnext,
          h: h,
          k1: k1,
          tnh: tnh,
          hk1: hk1,
          Phk1: Phk1,
          k2: k2,
          Pexacta: solucionExacta(t),
          error: Math.abs(Pnext - solucionExacta(t)),
          intereses: Pnext - P0 - (deposito_continuo * t),
          formula: `P${i} = P${i-1} + (h/2)(k1+k2)`
        });
        
        P = Pnext;
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
    setP0(1000);
    setR(0.08);
    setD(100);
    setYears(10);
    setH(1/12);
    setMetodoSeleccionado('ambos');
    setShowResults(false);
  };

  // Calcular total depositado
  const totalDepositado = P0 + (D * 12 * years);

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
      <div className="bg-gradient-to-r from-sky-400 to-cyan-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Crecimiento de Inversiones</h1>
            <p className="text-green-100 mt-2">Métodos Numéricos: Euler y Heun</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-cyan-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <PiggyBank className="w-8 h-8 mr-3 text-cyan-500" />
          1. Descripción del Problema
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-6 border-l-4 border-cyan-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💰 Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Inviertes <strong>${P0}</strong> inicialmente en una cuenta que paga <strong>{(r * 100).toFixed(1)}% anual</strong> de interés 
              compuesto continuo. Además, depositas <strong>${D} cada mes</strong>. 
              ¿Cuánto dinero tendrás después de <strong>{years} años</strong>?
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-green-300">
                <div className="text-3xl mb-2">💵</div>
                <p className="text-sm font-semibold text-gray-700">Capital Inicial</p>
                <p className="text-2xl font-bold text-green-600">${P0.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-blue-300">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-sm font-semibold text-gray-700">Depósito Mensual</p>
                <p className="text-2xl font-bold text-blue-600">${D.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-purple-300">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-sm font-semibold text-gray-700">Tasa Anual</p>
                <p className="text-2xl font-bold text-purple-600">{(r * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">📋 Aplicaciones:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>💰 Planificación de ahorro para el retiro</li>
              <li>🏠 Ahorro para compra de vivienda</li>
              <li>🎓 Fondo para educación universitaria</li>
              <li>📊 Análisis de rentabilidad de inversiones</li>
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
            <h3 className="font-bold text-xl text-gray-800 mb-4">💵 Modelo de Crecimiento con Interés Continuo</h3>
            <p className="text-gray-700 mb-4">
              El capital crece por dos factores: <strong>intereses sobre el capital existente</strong> y <strong>depósitos periódicos</strong>:
            </p>
            
            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-3xl font-bold text-purple-700 mb-3">
                dP/dt = r·P + D
              </p>
              <p className="text-center text-sm text-gray-600">
                Donde D se expresa como tasa anual = ${D} × 12 = ${D * 12}/año
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Variables:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>P(t):</strong> Capital en el tiempo t</li>
                  <li>• <strong>r:</strong> Tasa de interés anual ({(r*100).toFixed(1)}%)</li>
                  <li>• <strong>D:</strong> Depósito continuo (${(D*12).toFixed(0)}/año)</li>
                  <li>• <strong>t:</strong> Tiempo en años</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Valores:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• P(0) = ${P0.toLocaleString()} (inicial)</li>
                  <li>• r = {r} = {(r*100).toFixed(1)}%</li>
                  <li>• D = ${D}/mes = ${D*12}/año</li>
                  <li>• t<sub>final</sub> = {years} años</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-300">
              <p className="font-semibold text-gray-800 mb-2">Solución Exacta:</p>
              <p className="text-center text-lg font-bold text-green-700">
                P(t) = (P<sub>0</sub> + D/r)e<sup>rt</sup> - D/r
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                P(t) = ({P0} + {(deposito_continuo/r).toFixed(2)})e<sup>{r}t</sup> - {(deposito_continuo/r).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-300">
            <h3 className="font-bold text-lg text-gray-800 mb-3">💡 Componentes del Crecimiento:</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-yellow-200">
                <p className="text-sm"><strong>r·P:</strong> Intereses generados por el capital existente</p>
                <p className="text-xs text-gray-600">Mientras más capital tienes, más intereses ganas</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-yellow-200">
                <p className="text-sm"><strong>+ D:</strong> Aportes periódicos constantes</p>
                <p className="text-xs text-gray-600">Depósitos mensuales que también generan intereses</p>
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
          {/* EULER */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔶 EULER</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-400 mb-4">
              <p className="text-center text-xl font-bold text-orange-700">
                P<sub>i+1</sub> = P<sub>i</sub> + h · (r·P<sub>i</sub> + D)
              </p>
            </div>
            <p className="text-sm text-gray-700">
              En cada paso, calculamos los intereses y sumamos el depósito para estimar el siguiente valor.
            </p>
          </div>

          {/* HEUN */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔷 HEUN</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-purple-400 mb-4">
              <div className="space-y-1 text-sm">
                <p><strong>k₁</strong> = r·P<sub>n</sub> + D</p>
                <p><strong>k₂</strong> = r·(P<sub>n</sub>+h·k₁) + D</p>
                <p className="text-center text-lg font-bold text-purple-700 mt-2">
                  P<sub>n+1</sub> = P<sub>n</sub> + (h/2)(k₁ + k₂)
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Mejora la precisión promediando dos tasas de crecimiento.
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
              💵 Capital Inicial ($)
            </label>
            <input
              type="number"
              value={P0}
              onChange={(e) => setP0(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Tasa Interés Anual (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={r * 100}
              onChange={(e) => setR(parseFloat(e.target.value) / 100)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Depósito Mensual ($)
            </label>
            <input
              type="number"
              value={D}
              onChange={(e) => setD(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⏱️ Plazo (años)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
            />
          </div>

<div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      📏 Paso h (años)
    </label>
    <select
      value={h}
      onChange={(e) => setH(parseFloat(e.target.value))}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
    >
      <option value={1/12}>1/12 (mensual)</option>
      <option value={1/6}>1/6 (bimestral)</option>
      <option value={1/4}>1/4 (trimestral)</option>
      <option value={1/2}>1/2 (semestral)</option>
      <option value={1}>1 (anual)</option>
    </select>
  </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Método a usar
            </label>
            <select
              value={metodoSeleccionado}
              onChange={(e) => setMetodoSeleccionado(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-cyan-300 to-cyan-300"
            >
              <option value="euler">Solución Euler</option>
              <option value="heun">Solución Heun</option>
              <option value="ambos">Comparar Ambos</option>
            </select>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-300 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600">Total a Depositar</p>
              <p className="text-xl font-bold text-green-700">${totalDepositado.toLocaleString()}</p>
              <p className="text-xs text-gray-500">${P0} + ${D}×12×{years}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-sky-400 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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
                <p className="text-sm mt-1">P<sub>i+1</sub> = P<sub>i</sub> + h · (r·P<sub>i</sub> + D)</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="border-2 border-orange-300 px-2 py-3">#</th>
                      <th className="border-2 border-orange-300 px-2 py-3">Año</th>
                      <th className="border-2 border-orange-300 px-2 py-3">Capital P(t) ($)</th>
                      <th className="border-2 border-orange-300 px-2 py-3">h</th>
                      <th className="border-2 border-orange-300 px-2 py-3">dP/dt</th>
                      <th className="border-2 border-orange-300 px-2 py-3 bg-green-50">P Exacto</th>
                      <th className="border-2 border-orange-300 px-2 py-3 bg-yellow-50">Error</th>
                      <th className="border-2 border-orange-300 px-2 py-3 bg-blue-50">Intereses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsEuler.filter((_, idx) => idx % Math.max(1, Math.floor(resultsEuler.length / 30)) === 0 || idx === resultsEuler.length - 1).map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-orange-50' : 'bg-white'}>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-semibold">{row.iteration}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center">{row.t.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono font-bold">${row.P.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center">{row.h.toFixed(4)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono">{row.ft.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono bg-green-50">${row.Pexacta.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono bg-yellow-50">${row.error.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono bg-blue-50">${row.intereses.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="font-semibold text-gray-800 mb-2">Resultado Final (Euler):</p>
                <div className="grid md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Capital Final</p>
                    <p className="text-xl font-bold text-green-600">
                      ${resultsEuler[resultsEuler.length - 1]?.P.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Depositado</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${totalDepositado.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Intereses Ganados</p>
                    <p className="text-xl font-bold text-purple-600">
                      ${(resultsEuler[resultsEuler.length - 1]?.P - totalDepositado).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Rentabilidad</p>
                    <p className="text-xl font-bold text-orange-600">
                      {(((resultsEuler[resultsEuler.length - 1]?.P - totalDepositado) / totalDepositado) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabla Heun */}
          {(metodoSeleccionado === 'heun' || metodoSeleccionado === 'ambos') && resultsHeun.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-300 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-bold">🔷 MÉTODO DE HEUN</h2>
                <p className="text-sm mt-1">P<sub>n+1</sub> = P<sub>n</sub> + (h/2)(k₁ + k₂)</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="border-2 border-purple-300 px-1 py-2">#</th>
                      <th className="border-2 border-purple-300 px-1 py-2">Año</th>
                      <th className="border-2 border-purple-300 px-1 py-2">P(t) ($)</th>
                      <th className="border-2 border-purple-300 px-1 py-2">h</th>
                      <th className="border-2 border-purple-300 px-1 py-2 bg-blue-50">k₁</th>
                      <th className="border-2 border-purple-300 px-1 py-2 bg-green-50">t+h</th>
                      <th className="border-2 border-purple-300 px-1 py-2 bg-green-50">h·k₁</th>
                      <th className="border-2 border-purple-300 px-1 py-2 bg-green-50">P+h·k₁</th>
                      <th className="border-2 border-purple-300 px-1 py-2 bg-yellow-50">k₂</th>
                      <th className="border-2 border-purple-300 px-1 py-2 bg-pink-50">P Exacto</th>
                      <th className="border-2 border-purple-300 px-1 py-2 bg-red-50">Error</th>
</tr>
</thead>
<tbody>
{resultsHeun.filter((_, idx) => idx % Math.max(1, Math.floor(resultsHeun.length / 30)) === 0 || idx === resultsHeun.length - 1).map((row, index) => (
<tr key={index} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-semibold">{row.iteration}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center">{typeof row.t === 'number' ? row.t.toFixed(2) : row.t}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono font-bold">{typeof row.P === 'number' ? `$${row.P.toFixed(2)}` : row.P}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center">{typeof row.h === 'number' ? row.h.toFixed(4) : row.h}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-blue-50">{typeof row.k1 === 'number' ? row.k1.toFixed(2) : row.k1}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center bg-green-50">{typeof row.tnh === 'number' ? row.tnh.toFixed(2) : row.tnh}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-green-50">{typeof row.hk1 === 'number' ? row.hk1.toFixed(2) : row.hk1}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-green-50">{typeof row.Phk1 === 'number' ? `$${row.Phk1.toFixed(2)}` : row.Phk1}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-yellow-50">{typeof row.k2 === 'number' ? row.k2.toFixed(2) : row.k2}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-pink-50">{typeof row.Pexacta === 'number' ? `$${row.Pexacta.toFixed(2)}` : row.Pexacta}</td>
  <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-red-50">{typeof row.error === 'number' ? `$${row.error.toFixed(2)}` : row.error}</td>
</tr>
))}
</tbody>
</table>
</div>
          <div className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-300">
            <p className="font-semibold text-gray-800 mb-2">Resultado Final (Heun):</p>
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-gray-600">Capital Final</p>
                <p className="text-xl font-bold text-green-600">
                  ${resultsHeun[resultsHeun.length - 1]?.P.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Depositado</p>
                <p className="text-xl font-bold text-blue-600">
                  ${totalDepositado.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Intereses Ganados</p>
                <p className="text-xl font-bold text-purple-600">
                  ${(resultsHeun[resultsHeun.length - 1]?.P - totalDepositado).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Rentabilidad</p>
                <p className="text-xl font-bold text-purple-600">
                  {(((resultsHeun[resultsHeun.length - 1]?.P - totalDepositado) / totalDepositado) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARACIÓN */}
      {metodoSeleccionado === 'ambos' && resultsEuler.length > 0 && resultsHeun.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-300 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Comparación de Métodos - Inversión
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border-2 border-orange-300">
              <div className="flex items-center mb-4">
                <span className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">E</span>
                <p className="text-lg font-semibold">Euler</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">Capital Final: <strong className="text-green-600">${resultsEuler[resultsEuler.length - 1]?.P.toFixed(2)}</strong></p>
                <p className="text-sm">Intereses: <strong className="text-purple-600">${(resultsEuler[resultsEuler.length - 1]?.P - totalDepositado).toFixed(2)}</strong></p>
                <p className="text-sm">Error vs Exacta: <strong className="text-red-600">${resultsEuler[resultsEuler.length - 1]?.error.toFixed(2)}</strong></p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border-2 border-purple-300">
              <div className="flex items-center mb-4">
                <span className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">H</span>
                <p className="text-lg font-semibold">Heun</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">Capital Final: <strong className="text-green-600">${resultsHeun[resultsHeun.length - 1]?.P.toFixed(2)}</strong></p>
                <p className="text-sm">Intereses: <strong className="text-purple-600">${(resultsHeun[resultsHeun.length - 1]?.P - totalDepositado).toFixed(2)}</strong></p>
                <p className="text-sm">Error vs Exacta: <strong className="text-red-600">${resultsHeun[resultsHeun.length - 1]?.error.toFixed(2)}</strong></p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-teal-300 mb-6">
            <div className="flex items-center mb-4">
              <span className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">✓</span>
              <p className="text-lg font-semibold">Solución Exacta</p>
            </div>
            <p className="text-sm">Capital Final (Exacto): <strong className="text-green-600">${solucionExacta(years).toFixed(2)}</strong></p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="font-bold text-gray-800 mb-2">💡 Análisis:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Depositaste: ${totalDepositado.toLocaleString()} en {years} años</li>
              <li>✓ Ganaste aproximadamente: ${(solucionExacta(years) - totalDepositado).toFixed(2)} en intereses</li>
              <li>✓ Rentabilidad total: {(((solucionExacta(years) - totalDepositado) / totalDepositado) * 100).toFixed(1)}%</li>
              <li>✓ Tu dinero se multiplicó por: {(solucionExacta(years) / P0).toFixed(2)}x</li>
            </ul>
          </div>
        </div>
      )}

      {/* Interpretación */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-300 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">💰 Interpretación Práctica</h3>
        <div className="space-y-3 text-gray-700">
          {(() => {
            const results = metodoSeleccionado === 'euler' || metodoSeleccionado === 'ambos' 
              ? resultsEuler 
              : resultsHeun;
            const final = results[results.length - 1];
            const interesesGanados = final.P - totalDepositado;
            const rentabilidad = (interesesGanados / totalDepositado) * 100;
            
            return (
              <>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">💵</span>
                  <span>
                    Comenzaste con <strong>${P0.toLocaleString()}</strong> y depositaste <strong>${D.toLocaleString()}</strong> cada mes durante <strong>{years} años</strong>.
                  </span>
                </p>
                
                <p className="flex items-start">
                  <span className="text-2xl mr-3">📈</span>
                  <span>
                    Al final tendrás aproximadamente <strong className="text-green-600">${final.P.toFixed(2)}</strong>, habiendo depositado un total de <strong>${totalDepositado.toLocaleString()}</strong>.
                  </span>
                </p>
                
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🎉</span>
                  <span>
                    Ganaste <strong className="text-purple-600">${interesesGanados.toFixed(2)}</strong> en intereses compuestos, 
                    lo que representa una <strong>rentabilidad de {rentabilidad.toFixed(1)}%</strong> sobre lo depositado.
                  </span>
                </p>

                <p className="flex items-start">
                  <span className="text-2xl mr-3">⏱️</span>
                  <span>
                    Con una tasa de <strong>{(r * 100).toFixed(1)}% anual</strong>, tu dinero crece exponencialmente. 
                    Cada año ganas intereses no solo sobre tu capital inicial, sino también sobre los intereses acumulados.
                  </span>
                </p>

                <p className="flex items-start">
                  <span className="text-2xl mr-3">💡</span>
                  <span>
                    El <strong>interés compuesto</strong> es tu mejor aliado: mientras más tiempo dejes crecer tu inversión, 
                    mayor será el efecto multiplicador. ¡Empieza a ahorrar lo antes posible!
                  </span>
                </p>
              </>
            );
          })()}
        </div>
      </div>
    </>
  )}
</div>
);
};
export default Finanzas;