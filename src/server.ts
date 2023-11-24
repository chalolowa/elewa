import express from 'express';
import path from 'path';
import route from './routes';

const server = express();

server.use(express.json());
server.use()
server.use(express.urlencoded({extended: true}));
server.use(express.static(path.join(__dirname, 'public')));
server.use('/css', express.static(path.join(__dirname, 'public/css')));
server.use('/assets', express.static(path.join(__dirname, 'public/assets')));

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(route);

export default server;

