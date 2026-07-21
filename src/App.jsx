import React from 'react';
import MobilePrototype from './components/MobilePrototype';

function App() {
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      overflowX: 'hidden',
      background: '#060810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
      boxSizing: 'border-box'
    }}>
      <MobilePrototype />
    </div>
  );
}

export default App;
