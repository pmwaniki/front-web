import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from "axios";

import {Provider} from "react-redux";
import {createStore,applyMiddleware,compose,combineReducers} from "redux";
import thunk from "redux-thunk"
//import {composeWithDevTools} from "redux-devtools-extension";

import imagesReducer from "./store/reducers/images";
import correctionsReducer from "./store/reducers/corrections";
import authReducer from "./store/reducers/auth";
import config from "./config";

const rootReducer=combineReducers({
    images:imagesReducer,
    corrections:correctionsReducer,
    auth:authReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);

axios.defaults.baseURL = config.bandendURL ;
axios.interceptors.request.use( config=>{
  console.log("requesting:",config);
  return config;
},
error=>{
  console.log("Error:",error);
  return Promise.reject(error);
});

ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();
