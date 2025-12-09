import React from 'react';
import { Activity, GitBranch, TrendingUp, User, Mail, GraduationCap, BookOpen, Sparkles, Target, Brain, Code, CheckCircle } from 'lucide-react';

const Home = () => {
  const topics = [
    {
      title: 'Integración Numérica',
      icon: Activity,  
      methods: ['Regla del Trapecio', 'Simpson 1/3', 'Simpson 3/8'],
      color: 'from-purple-600 to-violet-600',
      bgColor: 'from-purple-50/80 to-violet-50/80',
      borderColor: 'border-purple-200',
      description: 'Cálculo de áreas bajo curvas y análisis de señales periódicas',
      applications: ['Procesamiento de señales', 'Análisis energético', 'Cálculo de poblaciones'],
      projects: ['Energía de señales de radio', 'Población acumulada']
    },
    {
      title: 'Raíces de Ecuaciones',
      icon: GitBranch,
      methods: ['Método de Bisección', 'Newton-Raphson'],
      color: 'from-blue-600 to-sky-600',
      bgColor: 'from-blue-50/80 to-sky-50/80',
      borderColor: 'border-blue-200',
      description: 'Búsqueda de soluciones a ecuaciones no lineales',
      applications: ['Ingeniería balística', 'Optimización', 'Análisis de trayectorias'],
      projects: ['Trayectoria de proyectiles']
    },
    {
      title: 'Ecuaciones Diferenciales',
      icon: TrendingUp,
      methods: ['Método de Euler', 'Método de Heun'],
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'from-emerald-50/80 to-teal-50/80',
      borderColor: 'border-emerald-200',
      description: 'Modelado de sistemas dinámicos en el tiempo',
      applications: ['Dinámica de fluidos', 'Circuitos eléctricos', 'Crecimiento poblacional'],
      projects: ['En desarrollo']
    },
  ];

  const selectedProjects = [
    {
      title: 'Trayectoria de Proyectil',
      description: 'Cálculo de distancia donde un proyectil alcanza cierta altura usando Bisección y Newton-Raphson',
      icon: Target,
      color: 'from-orange-500 to-amber-500',
      topic: 'Raíces de Ecuaciones'
    },
    {
      title: 'Población Acumulada',
      description: 'Cálculo de población total acumulada usando métodos de integración numérica',
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-500',
      topic: 'Integración Numérica'
    },
    {
      title: 'Energía de Señal de Radio',
      description: 'Análisis energético de señales periódicas mediante integración numérica',
      icon: Activity,
      color: 'from-violet-500 to-purple-500',
      topic: 'Integración Numérica'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-emerald-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 font-semibold text-sm tracking-wide">Métodos Numéricos Aplicados</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Análisis
            </span>
            <span className="text-gray-900 ml-4">Numérico</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Implementaciones interactivas de métodos numéricos para resolver problemas reales 
            con precisión y claridad visual
          </p>
        </div>

        {/* Student Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-gray-100 shadow-xl shadow-blue-100/20 mb-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Proyecto Académico</p>
              <h2 className="text-3xl font-bold text-gray-900">Información del Estudiante</h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre Completo</p>
                  <p className="text-2xl font-bold text-gray-900 leading-tight">Abigail Blanca Mamani Mamani</p>
                </div>
              </div>
              
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Carrera</p>
                  <p className="text-2xl font-bold text-gray-900 leading-tight">Informática</p>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>

        {/* Selected Topics Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Temas Seleccionados</h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl">
                Estos son los métodos numéricos que se han implementado en este proyecto para resolver problemas aplicados
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-white rounded-full border border-gray-200">
                <span className="text-sm font-semibold text-gray-700">{topics.length} categorías principales</span>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/30 hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${topic.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{topic.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed font-light">{topic.description}</p>
                  
                  <div className="mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Métodos Implementados</p>
                    <div className="space-y-2.5">
                      {topic.methods.map((method, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-800 group/item">
                          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${topic.color} flex-shrink-0`}></div>
                          <span className="font-medium group-hover/item:text-gray-900 transition-colors">{method}</span>
                          <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  
                </div>
              );
            })}
          </div>
        </div>


        {/* About Section */}
        <div className="bg-gradient-to-br from-purple-50/60 via-blue-50/60 to-cyan-50/60 rounded-3xl p-10 border border-purple-100 shadow-xl shadow-blue-100/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sobre este Proyecto</h2>
              <p className="text-purple-600 font-medium">Innovación Educativa en Métodos Numéricos</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 font-light">
                Este proyecto presenta una plataforma interactiva que transforma métodos numéricos abstractos 
                en herramientas visuales e intuitivas para resolver problemas del mundo real. Cada implementación 
                combina teoría matemática con aplicaciones prácticas en ingeniería y ciencias.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="font-medium">Visualización interactiva de resultados</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Comparación de métodos en tiempo real</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="font-medium">Validación con soluciones analíticas</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Características Destacadas</h3>
              <ul className="space-y-4">
                
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">Cálculos en tiempo real</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">Análisis de error y comparación de métodos</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">Documentación detallada de cada método</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Proyecto de Métodos Numéricos • Informática • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;