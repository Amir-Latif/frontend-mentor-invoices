import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './store/store';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
// Images
import AmirLatifIcon from './components/assets/amir-latif.png';
import DropdownArrow from './components/assets/dropdown-arrow.svg';
import IconArrowRight from './components/assets/icon-arrow-right.svg';
import IconArrowLeft from './components/assets/icon-arrow-left.svg';
import IconCrescent from './components/assets/icon-crescent.svg';
import IconPlus from './components/assets/icon-plus.svg';
import IconSun from './components/assets/icon-sun.svg';
import Logo from './components/assets/logo.svg';
export { AmirLatifIcon, IconArrowRight, IconArrowLeft, IconCrescent, DropdownArrow, IconPlus, IconSun, Logo };


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();
