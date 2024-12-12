import React from "react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { hydrate, render } from "react-dom";
import { HelmetProvider } from "react-helmet-async";

global.Buffer = global.Buffer || require("buffer").Buffer;

const APP = (
  <HelmetProvider>
    <Provider store={store}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </Provider>
  </HelmetProvider>
);
const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(APP, rootElement);
} else {
  render(APP, rootElement);
}
