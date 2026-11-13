export enum LearningResourceType {
  PDF = "pdf",
  IMAGE = "image",
  LINK = "link",
}

export interface LearningResource {
  type: LearningResourceType;
  url: string;
  fileName?: string;
}
