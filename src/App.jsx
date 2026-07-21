import React from 'react';
import MobilePrototype from './components/MobilePrototype';

function App() {
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: '#060810',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <MobilePrototype />
    </div>
  );
}

export default App;
