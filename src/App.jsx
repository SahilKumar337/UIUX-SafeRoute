import React from 'react';
import MobilePrototype from './components/MobilePrototype';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#04060A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    }}>
      <MobilePrototype />
    </div>
  );
}

export default App;
