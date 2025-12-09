/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import IntegracionNumerica from './pages/IntegracionNumerica';
import Raices from './pages/Raices';
import EcuacionesDiferenciales from './pages/EcuacionesDiferenciales';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'integracion':
        return <IntegracionNumerica />;
      case 'raices':
        return <Raices />;
      case 'ecuaciones':
        return <EcuacionesDiferenciales />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
