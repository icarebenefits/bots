import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import {botsApp} from './reducers';

// create a logger

const logger = createLogger();
const middleware = [ReduxThunk, logger];

export const Store = createStore(botsApp, {}, applyMiddleware(...middleware));