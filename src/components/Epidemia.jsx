import React, { useState } from 'react';
import { ArrowLeft, Calculator, Activity, Users, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

const Epidemia = ({ onBack }) => {
  // Estados para los inputs
  const [S0, setS0] = useState(999); // Susceptibles iniciales
  const [I0, setI0] = useState(1);   // Infectados iniciales
  const [R0, setR0] = useState(0);   // Recuperados iniciales
  const [beta, setBeta] = useState(0.0005); // Tasa de infección
  const [gamma, setGamma] = useState(0.1);  // Tasa de recuperación
  const [h, setH] = useState(1);     // Tamaño de paso (días)
  const [tFinal, setTFinal] = useState(100); // Tiempo final (días)
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('ambos');

  // Estados para resultados
  const [resultsEuler, setResultsEuler] = useState([]);
  const [resultsHeun, setResultsHeun] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const N = S0 + I0 + R0; // Población total

  // Sistema de ecuaciones diferenciales del modelo SIR
  const fS = (t, S, I, R) => -beta * S * I;
  const fI = (t, S, I, R) => beta * S * I - gamma * I;
  const fR = (t, S, I, R) => gamma * I;

  // Número básico de reproducción R0
  const R0_basico = (beta * N) / gamma;

  // Método de Euler para sistemas
  const calculateEuler = () => {
    const results = [];
    let t = 0;
    let S = S0;
    let I = I0;
    let R = R0;
    const steps = Math.floor(tFinal / h);

    for (let i = 0; i <= steps; i++) {
      const dS = fS(t, S, I, R);
      const dI = fI(t, S, I, R);
      const dR = fR(t, S, I, R);
      
      results.push({
        iteration: i,
        t: t,
        S: S,
        I: I,
        R: R,
        h: h,
        dS: dS,
        dI: dI,
        dR: dR,
        total: S + I + R
      });
      
      if (i < steps) {
        S = S + h * dS;
        I = I + h * dI;
        R = R + h * dR;
        t = t + h;
      }
    }

    return results;
  };

  // Método de Heun para sistemas
  const calculateHeun = () => {
    const results = [];
    let t = 0;
    let S = S0;
    let I = I0;
    let R = R0;
    const steps = Math.floor(tFinal / h);

    for (let i = 0; i <= steps; i++) {
      if (i === 0) {
        results.push({
          iteration: 0,
          t: t,
          S: S,
          I: I,
          R: R,
          h: h,
          k1_S: '-',
          k1_I: '-',
          k1_R: '-',
          S_pred: '-',
          I_pred: '-',
          R_pred: '-',
          k2_S: '-',
          k2_I: '-',
          k2_R: '-',
          total: S + I + R
        });
      } else {
        // k1 (pendientes iniciales)
        const k1_S = fS(t, S, I, R);
        const k1_I = fI(t, S, I, R);
        const k1_R = fR(t, S, I, R);
        
        // Predicción tipo Euler
        const S_pred = S + h * k1_S;
        const I_pred = I + h * k1_I;
        const R_pred = R + h * k1_R;
        
        // k2 (pendientes corregidas)
        const k2_S = fS(t + h, S_pred, I_pred, R_pred);
        const k2_I = fI(t + h, S_pred, I_pred, R_pred);
        const k2_R = fR(t + h, S_pred, I_pred, R_pred);
        
        // Actualizar con promedio de pendientes
        const S_next = S + (h / 2) * (k1_S + k2_S);
        const I_next = I + (h / 2) * (k1_I + k2_I);
        const R_next = R + (h / 2) * (k1_R + k2_R);
        
        t = t + h;
        
        results.push({
          iteration: i,
          t: t,
          S: S_next,
          I: I_next,
          R: R_next,
          h: h,
          k1_S: k1_S,
          k1_I: k1_I,
          k1_R: k1_R,
          S_pred: S_pred,
          I_pred: I_pred,
          R_pred: R_pred,
          k2_S: k2_S,
          k2_I: k2_I,
          k2_R: k2_R,
          total: S_next + I_next + R_next
        });
        
        S = S_next;
        I = I_next;
        R = R_next;
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
    setS0(999);
    setI0(1);
    setR0(0);
    setBeta(0.0005);
    setGamma(0.1);
    setH(1);
    setTFinal(100);
    setMetodoSeleccionado('ambos');
    setShowResults(false);
  };

  // Encontrar el pico de infectados
  const findPeak = (results) => {
    let maxI = 0;
    let peakDay = 0;
    results.forEach(row => {
      if (row.I > maxI) {
        maxI = row.I;
        peakDay = row.t;
      }
    });
    return { maxI, peakDay };
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
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Modelo SIR - Propagación de Epidemias</h1>
            <p className="text-red-100 mt-2">Métodos Numéricos: Euler y Heun</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Activity className="w-8 h-8 mr-3 text-green-500" />
          1. Descripción del Problema
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🦠 Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              En una población de <strong>1000 personas</strong>, aparece <strong>1 persona infectada</strong> con una enfermedad contagiosa. 
              ¿Cómo se propaga la enfermedad? ¿Cuántas personas se infectarán? ¿Cuándo llegará al pico?
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-green-300">
                <div className="text-3xl mb-2">😊</div>
                <p className="text-sm font-semibold text-gray-700">Susceptibles (S)</p>
                <p className="text-2xl font-bold text-green-600">{S0}</p>
                <p className="text-xs text-gray-500">Pueden contagiarse</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-red-300">
                <div className="text-3xl mb-2">🤒</div>
                <p className="text-sm font-semibold text-gray-700">Infectados (I)</p>
                <p className="text-2xl font-bold text-red-600">{I0}</p>
                <p className="text-xs text-gray-500">Contagian a otros</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-blue-300">
                <div className="text-3xl mb-2">💪</div>
                <p className="text-sm font-semibold text-gray-700">Recuperados (R)</p>
                <p className="text-2xl font-bold text-blue-600">{R0}</p>
                <p className="text-xs text-gray-500">Inmunes</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">📋 Aplicaciones:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>🦠 Predicción de epidemias (COVID-19, gripe, sarampión)</li>
              <li>💉 Planificación de campañas de vacunación</li>
              <li>🏥 Gestión de recursos hospitalarios</li>
              <li>📊 Políticas de salud pública (cuarentenas, distanciamiento)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SISTEMA DE ECUACIONES */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Sistema de Ecuaciones Diferenciales
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Modelo SIR</h3>
            <p className="text-gray-700 mb-4">
              El modelo divide la población en tres compartimentos y describe cómo fluyen entre ellos:
            </p>
            
            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 mb-1">S</p>
                    <p className="text-xs text-gray-600">Susceptibles</p>
                  </div>
                  <div className="mx-4 text-2xl">→</div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600 mb-1">I</p>
                    <p className="text-xs text-gray-600">Infectados</p>
                  </div>
                  <div className="mx-4 text-2xl">→</div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-1">R</p>
                    <p className="text-xs text-gray-600">Recuperados</p>
                  </div>
                </div>
                
                <div className="text-center pt-4 border-t-2 border-gray-200 space-y-2">
                  <p className="text-xl font-bold text-purple-700">dS/dt = -βSI</p>
                  <p className="text-xl font-bold text-purple-700">dI/dt = βSI - γI</p>
                  <p className="text-xl font-bold text-purple-700">dR/dt = γI</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Variables:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>S(t):</strong> Susceptibles en tiempo t</li>
                  <li>• <strong>I(t):</strong> Infectados en tiempo t</li>
                  <li>• <strong>R(t):</strong> Recuperados en tiempo t</li>
                  <li>• <strong>N:</strong> Población total (constante)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Parámetros:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>β = {beta}:</strong> Tasa de infección</li>
                  <li>• <strong>γ = {gamma}:</strong> Tasa de recuperación</li>
                  <li>• <strong>R₀ = {R0_basico.toFixed(2)}:</strong> Número reproductivo</li>
                  <li>• <strong>N = {N}:</strong> Población total</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
              <p className="font-semibold text-gray-800 mb-2">⚠️ Número Reproductivo Básico (R₀):</p>
              <p className="text-center text-2xl font-bold text-yellow-700 mb-2">
                R₀ = βN/γ = {R0_basico.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700">
                {R0_basico > 1 
                  ? `✓ R₀ > 1: La epidemia SE PROPAGARÁ (cada infectado contagia a ${R0_basico.toFixed(1)} personas)`
                  : '✗ R₀ < 1: La epidemia NO se propagará (se extinguirá)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MÉTODOS NUMÉRICOS */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Calculator className="w-8 h-8 mr-3 text-blue-500" />
          3. Métodos Numéricos para Sistemas
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* EULER */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔶 EULER</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-orange-400 mb-4 text-sm">
              <p className="font-bold mb-2">Para cada ecuación:</p>
              <p>S<sub>i+1</sub> = S<sub>i</sub> + h · (-βS<sub>i</sub>I<sub>i</sub>)</p>
              <p>I<sub>i+1</sub> = I<sub>i</sub> + h · (βS<sub>i</sub>I<sub>i</sub> - γI<sub>i</sub>)</p>
              <p>R<sub>i+1</sub> = R<sub>i</sub> + h · (γI<sub>i</sub>)</p>
            </div>
            <p className="text-sm text-gray-700">
              Aplica Euler a cada ecuación del sistema independientemente.
            </p>
          </div>

          {/* HEUN */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🔷 HEUN</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-purple-400 mb-4 text-sm">
              <p className="font-bold mb-2">Para cada variable:</p>
              <p>1. Calcular k₁ (pendientes iniciales)</p>
              <p>2. Predecir valores: S*, I*, R*</p>
              <p>3. Calcular k₂ con predicciones</p>
              <p>4. Actualizar: (h/2)(k₁ + k₂)</p>
            </div>
            <p className="text-sm text-gray-700">
              Usa promedio de pendientes para cada ecuación del sistema.
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
              😊 Susceptibles Iniciales
            </label>
            <input
              type="number"
              value={S0}
              onChange={(e) => setS0(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🤒 Infectados Iniciales
            </label>
            <input
              type="number"
              value={I0}
              onChange={(e) => setI0(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💪 Recuperados Iniciales
            </label>
            <input
              type="number"
              value={R0}
              onChange={(e) => setR0(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👥 Población Total
            </label>
            <input
              type="number"
              value={N}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🦠 Tasa Infección (β)
            </label>
            <input
              type="number"
              step="0.0001"
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💊 Tasa Recuperación (γ)
            </label>
            <input
              type="number"
              step="0.01"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📏 Paso h (días)
            </label>
            <input
              type="number"
              step="0.1"
              value={h}
              onChange={(e) => setH(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⏱️ Tiempo Final (días)
            </label>
            <input
              type="number"
              value={tFinal}
              onChange={(e) => setTFinal(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Método a usar
            </label>
            <select
              value={metodoSeleccionado}
              onChange={(e) => setMetodoSeleccionado(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-green-300 to-green-300"
            >
              <option value="euler">Solución Euler</option>
              <option value="heun">Solución Heun</option>
              <option value="ambos">Comparar Ambos</option>
            </select>
          </div>

          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-300">
            <p className="text-xs font-semibold text-gray-600">R₀ (Reproductivo Básico)</p>
            <p className="text-2xl font-bold text-yellow-700">{R0_basico.toFixed(3)}</p>
            <p className="text-xs text-gray-600">
              {R0_basico > 1 ? '⚠️ Epidemia se propagará' : '✓ Epidemia controlada'}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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
                <p className="text-sm mt-1">Sistema: S<sub>i+1</sub>, I<sub>i+1</sub>, R<sub>i+1</sub></p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="border-2 border-orange-300 px-2 py-3">#</th>
                      <th className="border-2 border-orange-300 px-2 py-3">Día</th>
                      <th className="border-2 border-orange-300 px-2 py-3 bg-green-50">S<br/>Susceptibles</th>
                      <th className="border-2 border-orange-300 px-2 py-3 bg-red-50">I<br/>Infectados</th>
                      <th className="border-2 border-orange-300 px-2 py-3 bg-blue-50">R<br/>Recuperados</th>
                      <th className="border-2 border-orange-300 px-2 py-3">h</th>
                      <th className="border-2 border-orange-300 px-2 py-3">dS/dt</th>
                      <th className="border-2 border-orange-300 px-2 py-3">dI/dt</th>
                      <th className="border-2 border-orange-300 px-2 py-3">dR/dt</th>
                      <th className="border-2 border-orange-300 px-2 py-3 bg-gray-50">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsEuler.filter((_, idx) => idx % Math.max(1, Math.floor(resultsEuler.length / 30)) === 0 || idx === resultsEuler.length - 1).map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-orange-50' : 'bg-white'}>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-semibold">{row.iteration}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center">{row.t.toFixed(1)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono bg-green-50">{row.S.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono font-bold bg-red-50">{row.I.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono bg-blue-50">{row.R.toFixed(2)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center">{row.h}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono text-[10px]">{row.dS.toFixed(4)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono text-[10px]">{row.dI.toFixed(4)}</td>
                        <td className="border-2 border-orange-200 px-2 py-2 text-center font-mono text-[10px]">{row.dR.toFixed(4)}</td>
<td className="border-2 border-orange-200 px-2 py-2 text-center font-semibold bg-gray-50">{row.total.toFixed(1)}</td>
</tr>
))}
</tbody>
</table>
</div>
          {(() => {
            const peak = findPeak(resultsEuler);
            const finalDay = resultsEuler[resultsEuler.length - 1];
            return (
              <div className="mt-4 bg-orange-50 rounded-lg p-4 border border-orange-300">
                <p className="font-semibold text-gray-800 mb-3">Resultados (Euler):</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Pico de Infectados</p>
                    <p className="text-xl font-bold text-red-600">{peak.maxI.toFixed(0)} personas</p>
                    <p className="text-xs text-gray-500">en el día {peak.peakDay.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Afectados</p>
                    <p className="text-xl font-bold text-blue-600">{finalDay.R.toFixed(0)} personas</p>
                    <p className="text-xs text-gray-500">({((finalDay.R / N) * 100).toFixed(1)}% población)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">No Infectados</p>
                    <p className="text-xl font-bold text-green-600">{finalDay.S.toFixed(0)} personas</p>
                    <p className="text-xs text-gray-500">({((finalDay.S / N) * 100).toFixed(1)}% escaparon)</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tabla Heun */}
      {(metodoSeleccionado === 'heun' || metodoSeleccionado === 'ambos') && resultsHeun.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-300 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white p-4 rounded-lg mb-4">
            <h2 className="text-2xl font-bold">🔷 MÉTODO DE HEUN</h2>
            <p className="text-sm mt-1">Con corrección de pendientes para sistemas</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="bg-purple-100">
                  <th className="border-2 border-purple-300 px-1 py-2">#</th>
                  <th className="border-2 border-purple-300 px-1 py-2">Día</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-green-50">S</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-red-50">I</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-blue-50">R</th>
                  <th className="border-2 border-purple-300 px-1 py-2">h</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-yellow-50">k1_S</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-yellow-50">k1_I</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-yellow-50">k1_R</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-pink-50">k2_S</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-pink-50">k2_I</th>
                  <th className="border-2 border-purple-300 px-1 py-2 bg-pink-50">k2_R</th>
                </tr>
              </thead>
              <tbody>
                {resultsHeun.filter((_, idx) => idx % Math.max(1, Math.floor(resultsHeun.length / 30)) === 0 || idx === resultsHeun.length - 1).map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-semibold">{row.iteration}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center">{typeof row.t === 'number' ? row.t.toFixed(1) : row.t}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-green-50">{typeof row.S === 'number' ? row.S.toFixed(1) : row.S}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono font-bold bg-red-50">{typeof row.I === 'number' ? row.I.toFixed(1) : row.I}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-blue-50">{typeof row.R === 'number' ? row.R.toFixed(1) : row.R}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center">{row.h}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-yellow-50">{typeof row.k1_S === 'number' ? row.k1_S.toFixed(3) : row.k1_S}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-yellow-50">{typeof row.k1_I === 'number' ? row.k1_I.toFixed(3) : row.k1_I}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-yellow-50">{typeof row.k1_R === 'number' ? row.k1_R.toFixed(3) : row.k1_R}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-pink-50">{typeof row.k2_S === 'number' ? row.k2_S.toFixed(3) : row.k2_S}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-pink-50">{typeof row.k2_I === 'number' ? row.k2_I.toFixed(3) : row.k2_I}</td>
                    <td className="border-2 border-purple-200 px-1 py-1 text-center font-mono bg-pink-50">{typeof row.k2_R === 'number' ? row.k2_R.toFixed(3) : row.k2_R}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(() => {
            const peak = findPeak(resultsHeun);
            const finalDay = resultsHeun[resultsHeun.length - 1];
            return (
              <div className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-300">
                <p className="font-semibold text-gray-800 mb-3">Resultados (Heun):</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Pico de Infectados</p>
                    <p className="text-xl font-bold text-red-600">{peak.maxI.toFixed(0)} personas</p>
                    <p className="text-xs text-gray-500">en el día {peak.peakDay.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Afectados</p>
                    <p className="text-xl font-bold text-blue-600">{finalDay.R.toFixed(0)} personas</p>
                    <p className="text-xs text-gray-500">({((finalDay.R / N) * 100).toFixed(1)}% población)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">No Infectados</p>
                    <p className="text-xl font-bold text-green-600">{finalDay.S.toFixed(0)} personas</p>
                    <p className="text-xs text-gray-500">({((finalDay.S / N) * 100).toFixed(1)}% escaparon)</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* COMPARACIÓN */}
      {metodoSeleccionado === 'ambos' && resultsEuler.length > 0 && resultsHeun.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-300 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Comparación de Métodos - Epidemia
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {(() => {
              const peakEuler = findPeak(resultsEuler);
              const peakHeun = findPeak(resultsHeun);
              const finalEuler = resultsEuler[resultsEuler.length - 1];
              const finalHeun = resultsHeun[resultsHeun.length - 1];
              
              return (
                <>
                  <div className="bg-white rounded-xl p-6 border-2 border-orange-300">
                    <div className="flex items-center mb-4">
                      <span className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">E</span>
                      <p className="text-lg font-semibold">Euler</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Pico: <strong className="text-red-600">{peakEuler.maxI.toFixed(0)}</strong> (día {peakEuler.peakDay.toFixed(0)})</p>
                      <p className="text-sm">Afectados: <strong className="text-blue-600">{finalEuler.R.toFixed(0)}</strong></p>
                      <p className="text-sm">Sin infectar: <strong className="text-green-600">{finalEuler.S.toFixed(0)}</strong></p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border-2 border-purple-300">
                    <div className="flex items-center mb-4">
                      <span className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">H</span>
                      <p className="text-lg font-semibold">Heun</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Pico: <strong className="text-red-600">{peakHeun.maxI.toFixed(0)}</strong> (día {peakHeun.peakDay.toFixed(0)})</p>
                      <p className="text-sm">Afectados: <strong className="text-blue-600">{finalHeun.R.toFixed(0)}</strong></p>
                      <p className="text-sm">Sin infectar: <strong className="text-green-600">{finalHeun.S.toFixed(0)}</strong></p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="mt-6 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="font-bold text-gray-800 mb-2">💡 Conclusiones:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ R₀ = {R0_basico.toFixed(2)} {R0_basico > 1 ? '→ Epidemia se propaga' : '→ Epidemia controlada'}</li>
              <li>✓ El pico de infectados ocurre alrededor del día {findPeak(resultsEuler).peakDay.toFixed(0)}</li>
              <li>✓ Aproximadamente {((resultsEuler[resultsEuler.length - 1].R / N) * 100).toFixed(1)}% de la población se infectará</li>
              <li>✓ Heun suele dar resultados más precisos que Euler</li>
            </ul>
          </div>
        </div>
      )}

      {/* Interpretación */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-300 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🦠 Interpretación Práctica</h3>
        <div className="space-y-3 text-gray-700">
          {(() => {
            const results = metodoSeleccionado === 'euler' || metodoSeleccionado === 'ambos' 
              ? resultsEuler 
              : resultsHeun;
            const peak = findPeak(results);
            const final = results[results.length - 1];
            
            return (
              <>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">📊</span>
                  <span>
                    La epidemia alcanza su <strong>pico máximo</strong> alrededor del día <strong className="text-red-600">{peak.peakDay.toFixed(0)}</strong> con aproximadamente <strong className="text-red-600">{peak.maxI.toFixed(0)} personas infectadas</strong> simultáneamente.
                  </span>
                </p>
                
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🏥</span>
                  <span>
                    Al final del período ({tFinal} días), <strong className="text-blue-600">{final.R.toFixed(0)} personas ({((final.R / N) * 100).toFixed(1)}%)</strong> habrán sido infectadas y recuperadas.
                  </span>
                </p>
                
                <p className="flex items-start">
                  <span className="text-2xl mr-3">😊</span>
                  <span>
                    <strong className="text-green-600">{final.S.toFixed(0)} personas ({((final.S / N) * 100).toFixed(1)}%)</strong> nunca se infectarán (inmunidad de rebaño o medidas de control).
                  </span>
                </p>

                <p className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <span>
                    Con R₀ = <strong>{R0_basico.toFixed(2)}</strong>, cada persona infectada contagia a {R0_basico.toFixed(1)} personas en promedio. 
                    {R0_basico > 1 ? ' La epidemia SE PROPAGARÁ.' : ' La epidemia NO se propagará.'}
                  </span>
                </p>

                <p className="flex items-start">
                  <span className="text-2xl mr-3">💉</span>
                  <span>
                    Para controlar la epidemia: reducir β (distanciamiento, mascarillas) o aumentar γ (tratamientos más efectivos, vacunación).
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
export default Epidemia;