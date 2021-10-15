import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Navbar } from './Navbar';
import { Provider } from "./context"
import "@fontsource/open-sans/600.css";
import "./styles.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <Navbar />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);