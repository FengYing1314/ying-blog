<template>
  <a
    class="friend-card"
    :href="friend.url"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="`${friend.name[locale]}${locale === 'zh' ? '（在新窗口中打开）' : ' (opens in a new window)'}`"
  >
    <div class="friend-avatar" aria-hidden="true">
      <img
        v-if="avatarUrl && !imageFailed"
        :src="avatarUrl"
        alt=""
        width="88"
        height="88"
        loading="lazy"
        decoding="async"
        @error="imageFailed = true"
      />
      <Globe v-else :size="30" />
    </div>
    <div class="friend-details">
      <h2>{{ friend.name[locale] }}</h2>
      <p>{{ friend.description[locale] }}</p>
      <span class="friend-domain">
        <LinkIcon :size="15" aria-hidden="true" />
        {{ domain }}
      </span>
    </div>
    <ArrowUpRight class="friend-external-icon" :size="18" aria-hidden="true" />
  </a>
</template>

<script setup lang="ts">
import { ArrowUpRight, Globe, Link as LinkIcon } from "@lucide/vue";
import { computed, ref, watch } from "vue";
import type { FriendLink } from "../config/friends";
import { withBasePath } from "../lib/paths";
import type { Locale } from "../types/content";

const props = defineProps<{ friend: FriendLink; locale: Locale }>();
const imageFailed = ref(false);
const avatarUrl = computed(() => {
  const avatar = props.friend.avatar;
  return avatar?.startsWith("/") ? withBasePath(avatar) : avatar;
});
const domain = computed(() => new URL(props.friend.url).hostname);

watch(avatarUrl, () => {
  imageFailed.value = false;
});
</script>
