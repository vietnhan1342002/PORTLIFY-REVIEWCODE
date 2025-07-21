import AppError from './AppError.js';

export default class ExistingError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409); 
  }
}
