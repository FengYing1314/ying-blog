---
locale: zh
slug: cmcc-rax3000m
title: CMCC RAX3000M 折腾记录
description: 记录 CMCC RAX3000M NAND 型号刷入 ImmortalWrt、uboot、TFTP 和网络配置时的流程与注意事项。
date: 2025-10-26
categories:
  - engineering
tags:
  - openwrt
  - networking
featured: true
order: 3
---

# CMCC RAX3000M 折腾记录

这篇文章记录我折腾硬路由 CMCC RAX3000M 的相关流程和注意事项。

::: callout warning
本文内容仅供学习和参考。刷机有风险，请在操作前确认设备型号、固件版本和备份方案。因跟随本文操作导致的任何数据丢失、设备损坏或其他直接、间接损失，需要自行承担风险。
:::

## 简要介绍

CMCC RAX3000M 分为普通版和算力版。普通版为 128M 闪存 NAND，算力版则有 64G eMMC 空间。

本文流程仅适用于 CMCC RAX3000M NAND 型号。这里只整理我觉得能帮到人的资料，主要细节流程在社区里也已经有很多帖子，因此这里并不完整。

如果你完全是小白，并且没有看过其他帖子，这篇文章可能帮不上忙，甚至可能让你更混乱。请酌情阅读。

## 相关资源

### 固件

- [ImmortalWrt 官方固件](https://firmware-selector.immortalwrt.org/?version=24.10.2&target=mediatek%2Ffilogic&id=cmcc_rax3000m)
- [hanwckf/immortalwrt-mt798x](https://github.com/hanwckf/immortalwrt-mt798x)：hanwckf 的二改 ImmortalWrt，基于 ImmortalWrt 21.02

两个固件最主要的区别是 hanwckf 对 798x 系列做了大量优化。如果只是当硬路由使用，我个人更推荐 hanwckf 的二改 ImmortalWrt。

### uboot

- [ImmortalWrt 官方固件页](https://firmware-selector.immortalwrt.org/?version=24.10.2&target=mediatek%2Ffilogic&id=cmcc_rax3000m)
- [hanwckf/bl-mt798x](https://github.com/hanwckf/bl-mt798x/)：hanwckf 出品的 uboot

如果想体验最新的 ImmortalWrt，请使用 ImmortalWrt 官方 uboot。hanwckf 出品的 uboot 又称为不死 uboot，在社区里反响很高，但是不支持官方 itb 格式固件，更适合搭配 hanwckf 的二改 ImmortalWrt，或官方 ImmortalWrt 23.05.4 及以下版本。

### 刷写工具

需要使用到的工具：

- SSH 客户端
- 支持 TFTP 的服务端，例如 tftpd

## 刷机流程

### 刷入 ImmortalWrt 官方固件

1. 解锁 SSH。
2. 通过 SSH 连接到路由器。
3. 刷入 uboot。
4. 使用 tftpd 刷入 `immortalwrt-mediatek-filogic-cmcc_rax3000m-initramfs-recovery.itb`。这是集成最小文件系统的 Linux 内核，适用于首次安装或故障恢复；如果固件是其他名称，请改成上述名称。
5. 浏览器打开 `http://192.168.1.1`。
6. 进入“系统 - 备份与升级 - 刷写新的固件”，选择官方 `cmcc_rax3000m-squashfs-sysupgrade.itb`。
7. 等待完成。

### 关于 BL2 分区

在我的这台 CMCC RAX3000M 上，常规流程是刷入 uboot 后刷入 `BL2` 分区，之后再次刷入 recovery 固件。但是中国移动官方固件底下 `BL2` 分区是锁定的，所以我没有刷写，直接使用 TFTP 工具刷写 recovery 固件，相当于跳过了 `BL2` 分区写入，后续使用没有发现明显错误。

之后成功刷写 ImmortalWrt 后，可以使用内核模块 `kmod-mtd-rw` 解锁再刷写 `BL2` 分区。这个问题困扰了我很久。

::: callout warning
跳过 `BL2` 写入有潜在风险，务必确认自己的设备与版本适配后再决定。具体可以参考 ImmortalWrt 的 [PR Description](https://github.com/immortalwrt/immortalwrt/pull/1075)，并以代码提交者提供的信息为准。
:::

### hanwckf 的二改 ImmortalWrt

1. 解锁 SSH。
2. 刷入 uboot。
3. 将本机网卡固定 IP 设为 `192.168.1.254`，网关设为 `192.168.1.1`。
4. 浏览器进入 `http://192.168.1.1`。
5. 选择后缀名为 `bin` 的固件，或其他兼容固件进行刷写。
6. 等待上传和校验完成，Web 页面会出现等待重启的界面。
7. 等待完成。

## 网络相关设置

hanwckf 的二改固件包含大量网络驱动优化，所以更趋向于开箱即用。如果选择 ImmortalWrt 官方固件，请根据自己的网络环境进行定制。

### 我的网络配置

我使用了 AdGuard Home 和 OpenClash：

- AdGuard Home 接管 Dnsmasq 的 53 端口。
- AdGuard Home 的上游服务器只有 `127.0.0.1:7874`。
- OpenClash 负责 DNS 解析和流量分流。

整体链路大致是：

```text
客户端设备
  -> ImmortalWrt 路由器
  -> AdGuard Home DNS 处理
  -> OpenClash DNS 解析
  -> OpenClash 流量分流
  -> 直连访问 / 代理访问
```

## 欢迎交流

如果对这篇记录有任何问题，欢迎交流。
