import mongoose from 'mongoose';
import api from './api';

export default (uri) => mongoose.connect(uri, { useNewUrlParser: true });

export { api };
