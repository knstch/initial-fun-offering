import React from 'react';
import './App.css';
import Header from "../Header";

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = (props) => {
  return (
          <div className="App">
            <Header/>
            {props.children}
          </div>
  );
}

export default App;
