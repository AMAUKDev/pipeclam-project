import './App.css';

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/authorisation/Login';
import Navbar from './components/authorisation/Navbar';
import { initMap, addDotToMap, addCheveronToMap, loadPipeclamMessagesOntoMap } from '../common/mapFunctions';

function App (){

  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    (
        async () => {
          const response = await fetch('http://localhost:8000/pages/pipeclam/', {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
          });
        const content = await response.json();
        const deviceGuid = Object.keys(content.message)[0];
        console.log(deviceGuid, content.message[deviceGuid])
        setDisplayName(displayName);

        // Initialise Map
        initMap('map');
        // Dataclam dots - no arrow
        addDotToMap('green', true, 'pulsing-green-dot')
        addDotToMap('red', true, 'pulsing-red-dot')
        addDotToMap('green', false, 'green-dot')
        addDotToMap('red', false, 'red-dot')
        
        // Pipeclam dots - cheveron
        addCheveronToMap('green', 'green-cheveron')
        addCheveronToMap('red', 'red-cheveron')
        loadPipeclamMessagesOntoMap(content.message[deviceGuid], deviceGuid);
        
        }
        
    )();
    
  });


  return(
    <div>
      <Router>
          <Navbar displayName={displayName} role={role} setDisplayName={setDisplayName} setRole={setRole}/>
          <h1 className="mt-5 text-center">Welcome To the Pipe Clam</h1>
          <Routes>
            <Route path="/login" element={<Login setDisplayName={setDisplayName}/>} />
          </Routes >
      </Router>
      <div id='map'>
        
      </div>
    </div>
  );
};

export default App;
