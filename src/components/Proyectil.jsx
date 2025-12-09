import React, { useState } from 'react';
import { ArrowLeft, Calculator, Rocket, BookOpen, Target } from 'lucide-react';

const Proyectil = ({ onBack }) => {
  // Estados para los inputs - VALORES CORREGIDOS
  const [v0, setV0] = useState(30); // Velocidad inicial (m/s)
  const [angulo, setAngulo] = useState(60); // Ángulo de lanzamiento (grados)
  const [alturaObjetivo, setAlturaObjetivo] = useState(5); // Altura objetivo (m) - ¡CORREGIDO!
  const [g, setG] = useState(9.8); // Gravedad (m/s²)
  
  // Para Bisección - INTERVALO CORREGIDO
  const [xMin, setXMin] = useState(10); // Distancia mínima - ¡CORREGIDO!
  const [xMax, setXMax] = useState(50); // Distancia máxima - ¡CORREGIDO!
  
  // Para Newton-Raphson - VALOR INICIAL CORREGIDO
  const [x0Newton, setX0Newton] = useState(25); // Valor inicial - ¡CORREGIDO!
  
  const [tolerancia, setTolerancia] = useState(0.0001);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('ambos');

  // Estados para resultados
  const [resultsBiseccion, setResultsBiseccion] = useState([]);
  const [resultsNewton, setResultsNewton] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Convertir ángulo a radianes
  const anguloRad = (angulo * Math.PI) / 180;

  // Coeficientes de la ecuación cuadrática
  // y = x·tan(θ) - (g·x²)/(2v₀²cos²(θ))
  // Cuando y = h (altura objetivo):
  // 0 = -ax² + bx - c
  // donde: a = g/(2v₀²cos²(θ)), b = tan(θ), c = h
  
  const a_coef = g / (2 * Math.pow(v0, 2) * Math.pow(Math.cos(anguloRad), 2));
  const b_coef = Math.tan(anguloRad);
  const c_coef = alturaObjetivo;

  // Función f(x) = b·x - a·x² - c = 0
  const f = (x) => {
    return b_coef * x - a_coef * Math.pow(x, 2) - c_coef;
  };

  // Derivada f'(x) = b - 2a·x
  const fPrima = (x) => {
    return b_coef - 2 * a_coef * x;
  };

  // Función para sugerir intervalo automáticamente
  const sugerirIntervalo = () => {
    const step = 5;
    let a = null;
    let b = null;
    
    for (let x = 0; x <= 100; x += step) {
      const fx = f(x);
      const nextFx = f(x + step);
      
      if (fx * nextFx <= 0) { // Cambio de signo
        a = x;
        b = x + step;
        break;
      }
    }
    
    if (a !== null) {
      setXMin(a);
      setXMax(b);
      // Sugerir valor inicial para Newton
      const sugeridoNewton = (a + b) / 2;
      setX0Newton(sugeridoNewton);
      
      // Mostrar mensaje informativo
      const fa = f(a).toFixed(4);
      const fb = f(b).toFixed(4);
      alert(`✅ Intervalo encontrado!\n\n` +
            `En [${a}, ${b}] hay cambio de signo:\n` +
            `f(${a}) = ${fa}\n` +
            `f(${b}) = ${fb}\n\n` +
            `Valor inicial sugerido para Newton: ${sugeridoNewton.toFixed(2)}`);
    } else {
      // Buscar donde la función es más cercana a cero
      let minX = 0;
      let minVal = Math.abs(f(0));
      
      for (let x = 1; x <= 100; x++) {
        const val = Math.abs(f(x));
        if (val < minVal) {
          minVal = val;
          minX = x;
        }
      }
      
      if (minVal < 50) { // Si encontramos un valor razonable
        const intervalo = 20;
        setXMin(Math.max(0, minX - intervalo));
        setXMax(minX + intervalo);
        setX0Newton(minX);
        
        alert(`⚠️ No se encontró cambio de signo claro.\n\n` +
              `Valor más cercano a cero: f(${minX.toFixed(2)}) = ${f(minX).toFixed(4)}\n` +
              `Intervalo sugerido: [${Math.max(0, minX - intervalo)}, ${minX + intervalo}]\n` +
              `Intenta ajustar altura objetivo o velocidad.`);
      } else {
        alert("❌ No se puede encontrar intervalo apropiado.\n\n" +
              "La función no cruza el eje x con los parámetros actuales.\n" +
              "Prueba con:\n" +
              "• Altura objetivo más baja\n" +
              "• Velocidad inicial mayor\n" +
              "• Ángulo más pronunciado");
      }
    }
  };

  // Soluciones exactas usando fórmula cuadrática
  const calcularRaicesExactas = () => {
    const discriminante = Math.pow(b_coef, 2) - 4 * a_coef * c_coef;
    
    if (discriminante < 0) {
      return { 
        x1: null, 
        x2: null, 
        mensaje: "⚠️ El proyectil no puede alcanzar esa altura con estos parámetros",
        tieneSolucion: false
      };
    }
    
    const x1 = (b_coef - Math.sqrt(discriminante)) / (2 * a_coef);
    const x2 = (b_coef + Math.sqrt(discriminante)) / (2 * a_coef);
    
    return { 
      x1, 
      x2, 
      mensaje: "✅ Dos soluciones encontradas",
      tieneSolucion: true
    };
  };

  // Método de Bisección
  const calculateBiseccion = () => {
    const results = [];
    let a = xMin;
    let b = xMax;
    let iteracion = 0;
    const maxIter = 100;

    // Verificar que hay cambio de signo
    const fa_inicial = f(a);
    const fb_inicial = f(b);
    
    if (fa_inicial * fb_inicial > 0) {
      
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
    let x = x0Newton;
    let iteracion = 0;
    const maxIter = 100;

    // Verificar que el valor inicial es razonable
    const fx0 = f(x);
    const fpx0 = fPrima(x);

    if (Math.abs(fpx0) < 1e-10) {
      alert(
        '❌ La derivada en x₀ es muy cercana a cero.\n\n' +
        `f'(${x0Newton.toFixed(2)}) = ${fpx0.toFixed(8)}\n\n` +
        'Newton-Raphson puede no converger.\n' +
        'Intenta con otro valor inicial o usa "Buscar Intervalo".'
      );
      return [];
    }

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
        alert('❌ Derivada muy cercana a cero. Newton-Raphson no puede continuar.');
        break;
      }

      // Calcular siguiente x
      x = x - fx / fpx;
      iteracion++;
    }

    return results;
  };

  const handleCalculate = () => {
    // Calcular raíces exactas primero
    const exactas = calcularRaicesExactas();
    
    if (!exactas.tieneSolucion && (metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos')) {
      alert("⚠️ No hay soluciones reales con los parámetros actuales.\n\n" +
            "La ecuación no tiene raíces reales. Ajusta los parámetros.");
      return;
    }

    if (metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos') {
      const biseccionResults = calculateBiseccion();
      if (biseccionResults.length > 0) {
        setResultsBiseccion(biseccionResults);
      }
    }

    if (metodoSeleccionado === 'newton' || metodoSeleccionado === 'ambos') {
      const newtonResults = calculateNewton();
      if (newtonResults.length > 0) {
        setResultsNewton(newtonResults);
      }
    }

    setShowResults(true);
  };

  const handleReset = () => {
    // Reset a valores que SÍ funcionan
    setV0(30);
    setAngulo(60);
    setAlturaObjetivo(5);
    setG(9.8);
    setXMin(10);
    setXMax(50);
    setX0Newton(25);
    setTolerancia(0.0001);
    setMetodoSeleccionado('ambos');
    setShowResults(false);
    setResultsBiseccion([]);
    setResultsNewton([]);
  };

  const raicesExactas = calcularRaicesExactas();

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
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
            <Rocket className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Trayectoria de Proyectil</h1>
            <p className="text-rose-100 mt-2">Métodos: Bisección y Newton-Raphson</p>
          </div>
        </div>
      </div>

      {/* EXPLICACIÓN DEL PROBLEMA */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-rose-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Target className="w-8 h-8 mr-3 text-rose-500" />
          1. Descripción del Problema
        </h2>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-6 border-l-4 border-rose-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Situación Real:</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Un proyectil se lanza con una <strong>velocidad inicial de {v0} m/s</strong> 
              a un <strong>ángulo de {angulo}°</strong>. ¿A qué <strong>distancia horizontal (x)</strong> el 
              proyectil alcanza una altura de <strong>{alturaObjetivo} metros</strong>?
            </p>

            <div className="grid md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 text-center border border-rose-200">
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-sm font-semibold text-gray-700">Velocidad v₀</p>
                <p className="text-2xl font-bold text-rose-600">{v0} m/s</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-rose-200">
                <div className="text-3xl mb-2">📐</div>
                <p className="text-sm font-semibold text-gray-700">Ángulo θ</p>
                <p className="text-2xl font-bold text-pink-600">{angulo}°</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-rose-200">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-sm font-semibold text-gray-700">Altura objetivo</p>
                <p className="text-2xl font-bold text-purple-600">{alturaObjetivo} m</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-rose-200">
                <div className="text-3xl mb-2">📏</div>
                <p className="text-sm font-semibold text-gray-700">Distancia x</p>
                <p className="text-lg text-gray-600">¿? m</p>
              </div>
            </div>
          </div>

          {!raicesExactas.tieneSolucion && (
            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
              <h3 className="font-bold text-lg text-red-800 mb-3">Advertencia:</h3>
              <p className="text-gray-700 mb-3">
                Con los parámetros actuales, el proyectil <strong>NO puede alcanzar {alturaObjetivo}m</strong>.
              </p>
              <div className="bg-white rounded-lg p-4 mb-3">
                <p className="font-semibold text-gray-800 mb-2">Sugerencias:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Reduce la altura objetivo a menos de {(b_coef*b_coef/(4*a_coef)).toFixed(2)}m</li>
                  <li>• Aumenta la velocidad inicial</li>
                  <li>• Cambia el ángulo de lanzamiento</li>
                </ul>
              </div>
              <button
                onClick={sugerirIntervalo}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                🎯 Buscar parámetros que funcionen
              </button>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-gray-800 mb-3">🎯 Aplicaciones:</h3>
            <ul className="space-y-2 text-gray-700 grid md:grid-cols-2 gap-2">
              <li className="flex items-center">🏀 <span className="ml-2">Basketball: calcular distancia de tiro</span></li>
              <li className="flex items-center">⚽ <span className="ml-2">Fútbol: tiros a portería</span></li>
              <li className="flex items-center">🎖️ <span className="ml-2">Balística militar</span></li>
              <li className="flex items-center">🚀 <span className="ml-2">Lanzamiento de cohetes</span></li>
              <li className="flex items-center">⛳ <span className="ml-2">Golf: distancia de golpe</span></li>
              <li className="flex items-center">🎪 <span className="ml-2">Acrobacias y stunts</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ECUACIÓN */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-500" />
          2. Ecuación de Trayectoria Parabólica
        </h2>

        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Física del Movimiento</h3>
            <p className="text-gray-700 mb-4">
              La trayectoria de un proyectil bajo gravedad sigue una <strong>parábola</strong>:
            </p>

            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 mb-4">
              <p className="text-center text-2xl font-bold text-purple-700 mb-3">
                y(x) = x·tan(θ) - <span className="text-lg">g·x²</span>/<span className="text-lg">2v₀²cos²(θ)</span>
              </p>
              <p className="text-center text-sm text-gray-600">
                Ecuación de trayectoria parabólica
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-200 mb-4">
              <p className="font-semibold text-gray-800 mb-2">Cuando y = {alturaObjetivo} m:</p>
              <p className="text-center text-xl font-bold text-rose-700 mb-2">
                f(x) = {b_coef.toFixed(4)}x - {a_coef.toFixed(6)}x² - {c_coef} = 0
              </p>
              <p className="text-center text-sm text-gray-600">
                Ecuación cuadrática a resolver
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Coeficientes:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>a</strong> = g/(2v₀²cos²θ) = {a_coef.toFixed(6)}</li>
                  <li>• <strong>b</strong> = tan(θ) = {b_coef.toFixed(4)}</li>
                  <li>• <strong>c</strong> = altura = {c_coef}</li>
                  <li>• <strong>Discriminante</strong> = b² - 4ac = {(b_coef*b_coef - 4*a_coef*c_coef).toFixed(4)}</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Derivada (para Newton):</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>f'(x)</strong> = b - 2ax</li>
                  <li>• <strong>f'(x)</strong> = {b_coef.toFixed(4)} - {(2*a_coef).toFixed(6)}x</li>
                  <li>• <strong>Altura máxima posible</strong>:</li>
                  <li>• y_max = b²/(4a) = {(b_coef*b_coef/(4*a_coef)).toFixed(2)} m</li>
                </ul>
              </div>
            </div>

            {raicesExactas.x1 === null && (
              <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-300">
                <p className="font-semibold text-red-800 mb-2">❌ Sin Solución Real:</p>
                <p className="text-sm text-gray-700">
                  {raicesExactas.mensaje}
                  <br />
                  <strong>Altura máxima posible:</strong> {(b_coef*b_coef/(4*a_coef)).toFixed(2)}m
                  <br />
                  <strong>Sugerencias:</strong> Reduce altura a menos de {(b_coef*b_coef/(4*a_coef) - 1).toFixed(2)}m
                </p>
              </div>
            )}

            {raicesExactas.x1 !== null && (
              <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-300">
                <p className="font-semibold text-gray-800 mb-2">Soluciones Exactas (Fórmula Cuadrática):</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tiro corto (x₁):</p>
                    <p className="text-xl font-bold text-green-700">
                      x₁ ≈ {raicesExactas.x1.toFixed(6)} m
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tiro largo (x₂):</p>
                    <p className="text-xl font-bold text-green-700">
                      x₂ ≈ {raicesExactas.x2.toFixed(6)} m
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  💡 El proyectil alcanza {alturaObjetivo}m en dos momentos: subiendo (x₁) y bajando (x₂)
                </p>
              </div>
            )}
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
              Encuentra la raíz reduciendo el intervalo a la mitad en cada iteración.
              <strong> Requiere cambio de signo en [a, b].</strong>
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
              Usa la tangente para converger rápidamente hacia la raíz.
              <strong> Requiere un buen valor inicial x₀.</strong>
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
              🚀 Velocidad Inicial v₀ (m/s)
            </label>
            <input
              type="number"
              value={v0}
              onChange={(e) => setV0(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📐 Ángulo θ (grados)
            </label>
            <input
              type="number"
              value={angulo}
              onChange={(e) => setAngulo(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Altura Objetivo (m)
            </label>
            <input
              type="number"
              value={alturaObjetivo}
              onChange={(e) => setAlturaObjetivo(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🌍 Gravedad g (m/s²)
            </label>
            <input
              type="number"
              step="0.1"
              value={g}
              onChange={(e) => setG(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📉 Límite Inferior a (m) - Bisección
            </label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📈 Límite Superior b (m) - Bisección
            </label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Valor Inicial x₀ (m) - Newton
            </label>
            <input
              type="number"
              value={x0Newton}
              onChange={(e) => setX0Newton(parseFloat(e.target.value))}
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
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📊 Método a usar
          </label>
          <select
            value={metodoSeleccionado}
            onChange={(e) => setMetodoSeleccionado(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none bg-gradient-to-r from-rose-300 to-pink-300"
          >
            <option value="biseccion">Bisección</option>
            <option value="newton">Newton-Raphson</option>
            <option value="ambos">Comparar Ambos</option>
          </select>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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

        <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
          <p className="font-semibold text-gray-800 mb-2">💡 Recomendaciones:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Usa "Buscar Intervalo" si no estás seguro de los valores</li>
            <li>• Para Bisección: asegúrate que f(a) y f(b) tengan signos opuestos</li>
            <li>• Para Newton: elige x₀ cerca de la raíz esperada</li>
            <li>• Altura máxima posible con estos parámetros: {(b_coef*b_coef/(4*a_coef)).toFixed(2)}m</li>
          </ul>
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
                <p className="text-sm mt-1">f(x) = {b_coef.toFixed(4)}x - {a_coef.toFixed(6)}x² - {c_coef} = 0</p>
                <p className="text-xs mt-1">Intervalo inicial: [{xMin}, {xMax}]</p>
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
                      <th className="border-2 border-amber-300 px-3 py-3 bg-yellow-50">|f(m)|</th>
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
                <p className="font-semibold text-gray-800 mb-2">Distancia encontrada (Bisección):</p>
                <p className="text-3xl font-bold text-amber-600">
                  x ≈ {resultsBiseccion[resultsBiseccion.length - 1]?.m.toFixed(6)} metros
                </p>
                {raicesExactas.x1 !== null && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Comparación con solución exacta:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border">
                        <p className="text-xs text-gray-600">Tiro corto (x₁):</p>
                        <p className="font-mono">{raicesExactas.x1.toFixed(6)} m</p>
                        <p className="text-xs text-blue-600">
                          Diferencia: {Math.abs(resultsBiseccion[resultsBiseccion.length - 1]?.m - raicesExactas.x1).toFixed(6)} m
                        </p>
                      </div>
                      <div className="bg-white rounded p-3 border">
                        <p className="text-xs text-gray-600">Tiro largo (x₂):</p>
                        <p className="font-mono">{raicesExactas.x2.toFixed(6)} m</p>
                        <p className="text-xs text-blue-600">
                          Diferencia: {Math.abs(resultsBiseccion[resultsBiseccion.length - 1]?.m - raicesExactas.x2).toFixed(6)} m
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {Math.abs(resultsBiseccion[resultsBiseccion.length - 1]?.m - raicesExactas.x1) < 
                       Math.abs(resultsBiseccion[resultsBiseccion.length - 1]?.m - raicesExactas.x2)
                        ? 'Raíz encontrada: Tiro corto (x₁)'
                        : 'Raíz encontrada: Tiro largo (x₂)'}
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-3">
                  🚀 El proyectil alcanza {alturaObjetivo}m de altura a esta distancia horizontal
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
                <p className="text-sm mt-1">f(x) = {b_coef.toFixed(4)}x - {a_coef.toFixed(6)}x² - {c_coef} = 0</p>
                <p className="text-xs mt-1">Valor inicial: x₀ = {x0Newton}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-rose-100">
                      <th className="border-2 border-rose-300 px-3 py-3">#</th>
                      <th className="border-2 border-rose-300 px-3 py-3">x</th>
                      <th className="border-2 border-rose-300 px-3 py-3">f(x)</th>
                      <th className="border-2 border-rose-300 px-3 py-3">f'(x)</th>
                      <th className="border-2 border-rose-300 px-3 py-3 bg-yellow-50">|f(x)|</th>
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
                <p className="font-semibold text-gray-800 mb-2">Distancia encontrada (Newton-Raphson):</p>
                <p className="text-3xl font-bold text-rose-600">
                  x ≈ {resultsNewton[resultsNewton.length - 1]?.x.toFixed(6)} metros
                </p>
                {raicesExactas.x1 !== null && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Comparación con solución exacta:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border">
                        <p className="text-xs text-gray-600">Tiro corto (x₁):</p>
                        <p className="font-mono">{raicesExactas.x1.toFixed(6)} m</p>
                        <p className="text-xs text-blue-600">
                          Diferencia: {Math.abs(resultsNewton[resultsNewton.length - 1]?.x - raicesExactas.x1).toFixed(6)} m
                        </p>
                      </div>
                      <div className="bg-white rounded p-3 border">
                        <p className="text-xs text-gray-600">Tiro largo (x₂):</p>
                        <p className="font-mono">{raicesExactas.x2.toFixed(6)} m</p>
                        <p className="text-xs text-blue-600">
                          Diferencia: {Math.abs(resultsNewton[resultsNewton.length - 1]?.x - raicesExactas.x2).toFixed(6)} m
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {Math.abs(resultsNewton[resultsNewton.length - 1]?.x - raicesExactas.x1) < 
                       Math.abs(resultsNewton[resultsNewton.length - 1]?.x - raicesExactas.x2)
                        ? 'Raíz encontrada: Tiro corto (x₁)'
                        : 'Raíz encontrada: Tiro largo (x₂)'}
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-3">
                  🚀 El proyectil alcanza {alturaObjetivo}m de altura a esta distancia horizontal
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
                📊 Comparación de Métodos
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border-2 border-amber-300 shadow-md">
                  <div className="flex items-center mb-4">
                    <span className="bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">B</span>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Bisección</p>
                      <p className="text-xs text-gray-500">Robusto y confiable</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-600 mb-2">Distancia horizontal:</p>
                    <p className="text-4xl font-bold text-amber-600">
                      {resultsBiseccion[resultsBiseccion.length - 1]?.m.toFixed(4)} m
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
                      <p className="text-xs text-gray-500">Rápido y preciso</p>
                    </div>
                  </div>
                  <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
                    <p className="text-sm text-gray-600 mb-2">Distancia horizontal:</p>
                    <p className="text-4xl font-bold text-rose-600">
                      {resultsNewton[resultsNewton.length - 1]?.x.toFixed(4)} m
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Iteraciones: {resultsNewton.length}
                    </p>
                  </div>
                </div>
              </div>

              {raicesExactas.x1 !== null && (
                <div className="bg-white rounded-xl p-6 border-2 border-green-400 shadow-md mb-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 text-xl font-bold">✓</span>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Soluciones Exactas</p>
                      <p className="text-xs text-gray-500">Fórmula cuadrática</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-2">🎯 Tiro corto (x₁):</p>
                      <p className="text-3xl font-bold text-green-600">
                        {raicesExactas.x1.toFixed(6)} m
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-2">🎯 Tiro largo (x₂):</p>
                      <p className="text-3xl font-bold text-green-600">
                        {raicesExactas.x2.toFixed(6)} m
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
                <h4 className="text-xl font-bold text-gray-800 mb-4">📈 Análisis:</h4>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">ITER. BISECCIÓN</p>
                    <p className="text-3xl font-bold text-amber-600">{resultsBiseccion.length}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">ITER. NEWTON</p>
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
                    <li>✓ El proyectil alcanza {alturaObjetivo}m en dos momentos diferentes (tiro corto y largo)</li>
                    <li>✓ <strong>Newton</strong> convergió en {resultsNewton.length} iteraciones</li>
                    <li>✓ <strong>Bisección</strong> necesitó {resultsBiseccion.length} iteraciones</li>
                    <li>✓ Ambos métodos encuentran la misma raíz (según el intervalo/valor inicial)</li>
                    <li>✓ Newton es más rápido pero requiere un buen x₀ inicial</li>
                    <li>✓ Diferencia entre métodos: {Math.abs(
                      resultsBiseccion[resultsBiseccion.length - 1]?.m - 
                      resultsNewton[resultsNewton.length - 1]?.x
                    ).toFixed(8)} m</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Interpretación */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border-2 border-rose-300 mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Interpretación Física</h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="text-2xl mr-3">📏</span>
                <span>
                  A una distancia horizontal de{' '}
                  <strong className="text-rose-600 text-xl">
                    {(metodoSeleccionado === 'biseccion' || metodoSeleccionado === 'ambos') && resultsBiseccion.length > 0
                      ? resultsBiseccion[resultsBiseccion.length - 1]?.m.toFixed(2)
                      : resultsNewton.length > 0 ? resultsNewton[resultsNewton.length - 1]?.x.toFixed(2) : '—'} metros
                  </strong>, el proyectil alcanza una altura de {alturaObjetivo} metros.
                </span>
              </p>

              <p className="flex items-start">
                <span className="text-2xl mr-3">🎯</span>
                <span>
                  Esta ecuación cuadrática tiene <strong>dos soluciones</strong>: una para el tiro ascendente (corto) 
                  y otra para el descendente (largo). Los métodos numéricos encuentran la raíz según el intervalo inicial.
                </span>
              </p>

              <p className="flex items-start">
                <span className="text-2xl mr-3">⚡</span>
                <span>
                  Con v₀ = {v0} m/s y θ = {angulo}°, el proyectil sigue una trayectoria parabólica 
                  alcanzando alturas diferentes en distintas distancias horizontales.
                </span>
              </p>

              <p className="flex items-start">
                <span className="text-2xl mr-3">🎓</span>
                <span>
                  <strong>Bisección</strong> es robusto (siempre converge si hay cambio de signo), mientras que 
                  <strong> Newton-Raphson</strong> es más rápido pero requiere un buen valor inicial x₀.
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Proyectil;