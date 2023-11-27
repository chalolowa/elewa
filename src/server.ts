import express from 'express';
import path from 'path';
import route from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';

const server = express();

server.use(cors);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(express.static(path.join(__dirname, 'public')));
server.use('/css', express.static(path.join(__dirname, 'public/css')));
server.use('/assets', express.static(path.join(__dirname, 'public/assets')));

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(route);

export default server;

