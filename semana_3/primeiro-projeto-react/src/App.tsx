import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./routes";

import GlobalStyle from "./styles/global";

const App: React.FC = () => {
  return (
    <div className="app">
      <GlobalStyle />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
};

export default App;