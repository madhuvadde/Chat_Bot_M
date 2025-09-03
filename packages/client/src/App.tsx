import { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';

function App() {
   const [message, setmessage] = useState('');
   useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => setmessage(data.message));
   }, []);
   return (
      <div className="p-4">
         <p className="font-bold text-3xl">{message}</p>
         <Button>They Call Him OG</Button>
      </div>
   );
}

export default App;
