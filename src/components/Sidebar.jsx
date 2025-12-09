import React, { useState } from 'react';
import { Menu, X, Home, Activity, GitBranch, TrendingUp } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'home', name: 'Inicio', icon: Home },
    { id: 'integracion', name: 'Integración Numérica', icon: Activity, 
      submenu: ['Trapecio', 'Simpson 1/3', 'Simpson 3/8'] },
    { id: 'raices', name: 'Raíces de Ecuaciones', icon: GitBranch,
      submenu: ['Bisección', 'Newton-Raphson'] },
    { id: 'ecuaciones', name: 'Ecuaciones Diferenciales', icon: TrendingUp,
      submenu: ['Método de Euler', 'Método de Heun'] },
  ];

  return (
    <>
      {/* Botón toggle para móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white text-gray-800 transition-all duration-300 z-40 shadow-xl border-r border-gray-200 ${
          isOpen ? 'w-72' : 'w-0 lg:w-20'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 ${!isOpen && 'lg:justify-center lg:w-full'}`}>
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg shadow-md">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                {isOpen && (
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Análisis Numérico
                    </h1>
                    <p className="text-xs text-gray-500">Métodos Prácticos</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:block text-gray-400 hover:text-gray-700 transition-colors"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.id);
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                        } ${!isOpen && 'lg:mx-auto'}`}
                      />
                      {isOpen && (
                        <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                          {item.name}
                        </span>
                      )}
                    </button>

                    {/* Submenu */}
                    {isOpen && item.submenu && isActive && (
                      <ul className="mt-2 ml-4 space-y-1 border-l-2 border-purple-300 pl-4">
                        {item.submenu.map((subitem, index) => (
                          <li key={index}>
                            <div className="text-sm text-gray-600 py-1 hover:text-purple-600 transition-colors cursor-pointer flex items-center">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                              {subitem}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Proyecto de</p>
                <p className="text-sm font-semibold text-gray-800">Métodos Numéricos</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;