import {Meteor} from 'meteor/meteor';
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {botsApp} from './reducers';

// create a logger
const logger = createLogger();
const middleware = [thunkMiddleware];
// enable logger
if(Meteor.settings.public.log.level === 'debug') {
  middleware.push(logger);
}

export const Store = createStore(botsApp, {}, applyMiddleware(...middleware));