import { useContext, useEffect, useState } from 'react';
import './App.css';
import { AllRoutes } from './components/AllRoutes';
import { AuthContext } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AllRoutes/>
    </div>
  );
}

export default App;
