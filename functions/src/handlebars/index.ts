import * as Handlebars from 'handlebars';
import { envHelper } from './helpers/envHelper';

Handlebars.registerHelper('env', envHelper);

export { Handlebars };
