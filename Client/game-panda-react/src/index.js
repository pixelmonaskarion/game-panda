import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import JoinRoom from './JoinRoom';
import Game from "./Game";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RootApp/>
);

function RootApp(props) {
	let path = window.location.pathname;
 	console.log(path)
	if (path === "/game") {
		return <Game/>
	} else if (path === "/joinRoom") {
		return <JoinRoom/>
	} else if (path === "/") {
		return <JoinRoom/>
	}
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();