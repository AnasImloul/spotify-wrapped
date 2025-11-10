/**
 * User Data Types
 * Types related to user profile and account information
 */

export interface UserData {
  username: string;
  email: string;
  country: string;
  createdFromFacebook: boolean;
  facebookUid?: string;
  birthdate: string;
  gender: string;
  postalCode?: string;
  mobileNumber?: string;
  mobileOperator?: string;
  mobileBrand?: string;
  creationTime: string;
}

