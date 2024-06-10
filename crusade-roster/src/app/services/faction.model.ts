export interface Faction {
  name: string;
  detachments: { name: string; url: string }[];
  characters: { name: string; url: string }[];
  battleline: { name: string; url: string }[];
  dedicatedTransports: { name: string; url: string }[];
  fortifications: { name: string; url: string }[];
  otherDatasheets: { name: string; url: string }[];
}
