import { describe, expect, it } from "vitest";
import { assertFriendsConfig } from "../scripts/content/generate-content";
import type { FriendLink } from "../src/config/friends";

const friend: FriendLink = {
  id: "example",
  name: { zh: "示例博客", en: "Example Blog" },
  description: { zh: "记录生活和技术。", en: "Notes on life and technology." },
  url: "https://example.com/",
};

describe("friend-link configuration", () => {
  it("accepts empty lists and bilingual links with supported avatars", () => {
    expect(() => assertFriendsConfig([])).not.toThrow();
    for (const avatar of [
      undefined,
      "/images/friends/example.png",
      "https://example.com/avatar.png",
    ]) {
      expect(() => assertFriendsConfig([{ ...friend, avatar }])).not.toThrow();
    }
  });

  it("rejects missing or duplicate identities", () => {
    expect(() => assertFriendsConfig([{ ...friend, id: " " }])).toThrow(/non-empty id/);
    expect(() => assertFriendsConfig([friend, { ...friend }])).toThrow(/Duplicate friend link id/);
  });

  it("rejects incomplete bilingual names and descriptions", () => {
    expect(() => assertFriendsConfig([{ ...friend, name: { ...friend.name, en: " " } }])).toThrow(
      /missing en name/,
    );
    expect(() =>
      assertFriendsConfig([{ ...friend, description: { ...friend.description, zh: "" } }]),
    ).toThrow(/missing zh description/);
  });

  it.each(["javascript:alert(1)", "mailto:hello@example.com", "/blog/", "//example.com/"])(
    "rejects non-HTTP site addresses: %s",
    (url) => {
      expect(() => assertFriendsConfig([{ ...friend, url }])).toThrow(/URL/);
    },
  );

  it.each([
    "data:image/png;base64,abc",
    "//example.com/avatar.png",
    "images/avatar.png",
    "/images/../secret.png",
  ])("rejects unsupported avatar addresses: %s", (avatar) => {
    expect(() => assertFriendsConfig([{ ...friend, avatar }])).toThrow(/avatar/);
  });
});
