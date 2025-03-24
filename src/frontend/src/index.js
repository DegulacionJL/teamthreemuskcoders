import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';
// If you're using Redux
import { ThemeProvider } from './theme/ThemeContext';

// If you're using Redux

// Use this if you're using Redux
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Use this if you're NOT using Redux
// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ThemeProvider>
//         <App />
//       </ThemeProvider>
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
