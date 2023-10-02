import React from 'react';

const Spinner = () => (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="loader ease-linear rounded-full border-4 border-t-4 h-12 w-12 mb-4"></div>
      <style>
        {`
          .loader {
            border-color: #004225; 
            border-top-color: #00FF00;
            -webkit-animation: spinner 1.5s linear infinite;
            animation: spinner 1.5s linear infinite;
          }
          @-webkit-keyframes spinner {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
          }
          @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

export default Spinner;
