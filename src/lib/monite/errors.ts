export class MoniteError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'MoniteError';
  }
}

export class MoniteAuthError extends MoniteError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'MoniteAuthError';
  }
}

export class MoniteInitError extends MoniteError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'MoniteInitError';
  }
}