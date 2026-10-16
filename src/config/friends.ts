import type { LocalizedText } from "../types/content";

export interface FriendLink {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  url: string;
  avatar?: string;
}

export const friendsAreExamples = false;

export const friendLinks: readonly FriendLink[] = [];
