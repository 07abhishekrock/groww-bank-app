import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import { SingleBankItemPage } from './components/SingleBankItem';
import {
  HashRouter as Router,
  Switch,
  Route,
  useParams,
  useLocation
} from "react-router-dom";



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/all-banks">
            <App/>
          </Route>
          <Route exact path="/bank-details/:ifsc">
            <SingleBankItemPage/>
          </Route>
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
