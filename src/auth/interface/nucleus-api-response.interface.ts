export interface NucleusApiResponse {
  AccessToken: string;
  UserId: string;
  FullName: string;
  EvType: string;
  EvCode?: string;
  data?: any;
}