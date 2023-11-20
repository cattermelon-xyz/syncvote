/* eslint-disable no-restricted-globals */
// import React from 'react';
// Dummy import to prevent build from failure

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};
// TODO: something wrong with the sleep function, it's only working in localhost
self.onmessage = (message) => {
  sleep(10000);
  self.postMessage('Done!');
};
