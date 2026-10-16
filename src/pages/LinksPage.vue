<template>
  <div class="page links-page shell-inner">
    <header class="page-header">
      <p class="eyebrow">FRIENDS</p>
      <h1>{{ page?.title ?? (locale === "zh" ? "友链" : "Friends") }}</h1>
      <p>
        {{
          locale === "zh"
            ? "一些值得常去的小站，也是在网络中遇见的朋友。"
            : "Small sites worth returning to, and friends met along the way."
        }}
      </p>
    </header>

    <section :aria-label="locale === 'zh' ? '友链列表' : 'Friends'">
      <p v-if="friendsAreExamples && friendLinks.length" class="friends-example-note">
        {{
          locale === "zh"
            ? "以下站点仅用于版式预览，名称与网址均为示例。"
            : "These sample names and URLs are for layout preview only."
        }}
      </p>
      <div v-if="friendLinks.length" class="friends-grid">
        <FriendCard
          v-for="friend in friendLinks"
          :key="friend.id"
          :friend="friend"
          :locale="locale"
        />
      </div>
      <div v-else class="friends-empty">
        <UsersRound :size="30" aria-hidden="true" />
        <h2>{{ locale === "zh" ? "友链还在慢慢整理" : "Making room for friends" }}</h2>
        <p>
          {{
            locale === "zh"
              ? "这里会放一些值得常去的小站，期待在网络中遇见更多朋友。"
              : "This space will hold small sites worth visiting and friends met along the way."
          }}
        </p>
      </div>
    </section>

    <section class="friends-exchange" :aria-label="locale === 'zh' ? '交换友链' : 'Exchange links'">
      <div class="friend-exchange-panel">
        <h2>{{ locale === "zh" ? "交换友链" : "Exchange links" }}</h2>
        <p>
          {{
            locale === "zh"
              ? "如果你也有在认真维护的小站，欢迎邮件联系。请附上站点名称、链接、头像和一句介绍。"
              : "If you also maintain a small site, feel free to email me with its name, URL, avatar, and a short introduction."
          }}
        </p>
        <a v-if="contactHref" class="friend-contact-link" :href="contactHref">
          <Mail :size="17" aria-hidden="true" />
          {{ locale === "zh" ? "邮件联系" : "Get in touch" }}
          <ArrowRight :size="16" aria-hidden="true" />
        </a>
      </div>

      <div class="friend-site-panel">
        <div class="friend-site-heading">
          <h2>{{ locale === "zh" ? "本站信息" : "This site" }}</h2>
          <button class="friend-copy-button" type="button" @click="copySiteInfo">
            <Check v-if="copyState === 'copied'" :size="16" aria-hidden="true" />
            <Copy v-else :size="16" aria-hidden="true" />
            {{
              copyState === "copied"
                ? locale === "zh"
                  ? "已复制"
                  : "Copied"
                : locale === "zh"
                  ? "复制本站信息"
                  : "Copy site info"
            }}
          </button>
        </div>
        <dl class="friend-site-info">
          <div>
            <dt>{{ locale === "zh" ? "站名" : "Name" }}</dt>
            <dd>{{ siteConfig.name[locale] }}</dd>
          </div>
          <div>
            <dt>{{ locale === "zh" ? "地址" : "URL" }}</dt>
            <dd>
              <a :href="siteUrl">{{ siteUrl }}</a>
            </dd>
          </div>
          <div>
            <dt>{{ locale === "zh" ? "头像" : "Avatar" }}</dt>
            <dd>
              <a
                :href="avatarUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="
                  locale === 'zh'
                    ? '查看个人头像（在新窗口中打开）'
                    : 'View avatar (opens in a new window)'
                "
              >
                {{ avatarUrl }}
              </a>
            </dd>
          </div>
          <div>
            <dt>{{ locale === "zh" ? "简介" : "About" }}</dt>
            <dd>{{ siteConfig.description[locale] }}</dd>
          </div>
        </dl>
        <p class="friend-copy-status" role="status" aria-live="polite">
          {{ copyStatus }}
        </p>
        <textarea
          v-if="copyState === 'failed'"
          ref="manualCopy"
          class="friend-manual-copy"
          :aria-label="locale === 'zh' ? '手动复制本站信息' : 'Manually copy site information'"
          :value="siteInfo"
          readonly
          rows="5"
          @focus="manualCopy?.select()"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Check, Copy, Mail, UsersRound } from "@lucide/vue";
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import FriendCard from "../components/FriendCard.vue";
import { friendLinks, friendsAreExamples } from "../config/friends";
import { profile } from "../config/profile";
import { siteConfig } from "../config/site";
import { getListingPage } from "../lib/content";
import { absoluteUrl, localizedPath } from "../lib/paths";
import { usePageSeo } from "../lib/seo";
import { sanitizeHref } from "../lib/urls";
import type { Locale } from "../types/content";

const props = defineProps<{ locale: Locale }>();
const page = computed(() => getListingPage(localizedPath(props.locale, "links")));
const siteUrl = absoluteUrl("/");
const avatarUrl = new URL(siteConfig.icon, `${siteConfig.url}/`).href;
const contactHref = computed(() => {
  const href = sanitizeHref(profile.socialLinks.find((link) => link.kind === "mail")?.href);
  return href?.startsWith("mailto:") ? href : undefined;
});
const siteInfo = computed(() =>
  [
    `${props.locale === "zh" ? "站名" : "Name"}: ${siteConfig.name[props.locale]}`,
    `${props.locale === "zh" ? "地址" : "URL"}: ${siteUrl}`,
    `${props.locale === "zh" ? "头像" : "Avatar"}: ${avatarUrl}`,
    `${props.locale === "zh" ? "简介" : "About"}: ${siteConfig.description[props.locale]}`,
  ].join("\n"),
);
const copyState = ref<"idle" | "copied" | "failed">("idle");
const manualCopy = ref<HTMLTextAreaElement | null>(null);
let resetCopyTimer: ReturnType<typeof setTimeout> | undefined;
const copyStatus = computed(() => {
  if (copyState.value === "copied") {
    return props.locale === "zh" ? "本站信息已复制。" : "Site information copied.";
  }
  if (copyState.value === "failed") {
    return props.locale === "zh"
      ? "自动复制不可用，请复制下方已选中的内容。"
      : "Automatic copying is unavailable. Copy the selected text below.";
  }
  return "";
});

async function copySiteInfo() {
  clearTimeout(resetCopyTimer);
  try {
    await navigator.clipboard.writeText(siteInfo.value);
    copyState.value = "copied";
    resetCopyTimer = setTimeout(() => {
      copyState.value = "idle";
    }, 2500);
  } catch {
    copyState.value = "failed";
    await nextTick();
    manualCopy.value?.focus();
    manualCopy.value?.select();
  }
}

watch(
  () => props.locale,
  () => {
    clearTimeout(resetCopyTimer);
    copyState.value = "idle";
  },
);
onBeforeUnmount(() => clearTimeout(resetCopyTimer));

usePageSeo(() => ({
  title: page.value?.title ?? "Friends",
  description: page.value?.description ?? "",
  path: localizedPath(props.locale, "links"),
  locale: props.locale,
  type: "listing",
  alternatePath: page.value?.counterpartPath,
}));
</script>
