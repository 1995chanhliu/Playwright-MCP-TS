import { expect } from '@playwright/test';

export class Validation {
  /**
   * Verify two values are equal
   */
  static verifyEqual(actual: any, expected: any, message?: string) {
    expect(actual, message).toEqual(expected);
  }

  /**
   * Verify two values are not equal
   */
  static verifyNotEqual(actual: any, expected: any, message?: string) {
    expect(actual, message).not.toEqual(expected);
  }

  /**
   * Verify actual string or array contains expected value
   */
  static verifyContains(actual: string | any[], expected: any, message?: string) {
    expect(actual, message).toContain(expected);
  }

  /**
   * Verify actual string or array does not contain expected value
   */
  static verifyNotContains(actual: string | any[], expected: any, message?: string) {
    expect(actual, message).not.toContain(expected);
  }

  /**
   * Verify condition is truthy
   */
  static verifyTrue(condition: any, message?: string) {
    expect(condition, message).toBeTruthy();
  }

  /**
   * Verify condition is falsy
   */
  static verifyFalse(condition: any, message?: string) {
    expect(condition, message).toBeFalsy();
  }

  /**
   * Verify a value is null
   */
  static verifyNull(actual: any, message?: string) {
    expect(actual, message).toBeNull();
  }

  /**
   * Verify a value is not null
   */
  static verifyNotNull(actual: any, message?: string) {
    expect(actual, message).not.toBeNull();
  }
}
