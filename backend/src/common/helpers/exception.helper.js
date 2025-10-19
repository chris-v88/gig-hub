export class BadRequestException extends Error {
  constructor(message = 'Bad Request Exception') {
    super(message);
    this.code = 400;
  }
}

// 403 => refresth-token
// or create custom 991 => refresh-token
export class ForbiddenException extends Error {
  constructor(message = 'Forbidden Exception') {
    super(message);
    this.code = 403;
  }
}

// 401 => logout
// or create custom 992 => logout
export class UnauthorizedException extends Error {
  constructor(message = 'Unauthorized Exception') {
    super(message);
    this.code = 401;
  }
}
