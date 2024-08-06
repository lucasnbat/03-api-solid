export class LateCheckInValidationError extends Error {
  constructor() {
    super('Check-in only can be balidated unitl 20 minutes of its creation')
  }
}
