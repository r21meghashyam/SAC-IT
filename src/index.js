import './style';
import App from './components/app';
import * as firebase from 'firebase';
import 'firebase/firestore';
export default App;


const config = {
	apiKey: 'AIzaSyBiv8n9P8Tq9yybLOhQRuCeLIQDGIY4oYY',
	authDomain: 'sac-it.firebaseapp.com',
	databaseURL: 'https://sac-it.firebaseio.com',
	projectId: 'sac-it',
	storageBucket: 'sac-it.appspot.com',
	messagingSenderId: '520393312941'
};
	
firebase.initializeApp(config);