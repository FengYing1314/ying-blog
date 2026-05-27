---
locale: en
slug: cmcc-rax3000m
title: CMCC RAX3000M Tinkering Notes
description: Notes on flashing ImmortalWrt, uboot, TFTP recovery, and network setup for the CMCC RAX3000M NAND model.
date: 2025-10-26
categories:
  - engineering
tags:
  - openwrt
  - networking
featured: true
order: 3
---

# CMCC RAX3000M Tinkering Notes

This post records my process and notes while tinkering with the CMCC RAX3000M router.

::: callout warning
This post is for learning and reference only. Flashing firmware is risky. Confirm your device model, firmware version, and backup plan before operating. Any data loss, device damage, or direct or indirect loss caused by following this post is your own responsibility.
:::

## Short Introduction

The CMCC RAX3000M has a standard edition and a compute edition. The standard edition uses 128M NAND flash, while the compute edition has 64G eMMC storage.

The process in this post only applies to the CMCC RAX3000M NAND model. I am only collecting the material that I personally found useful. Many detailed guides already exist in the community, so this post is not a complete guide.

If you are completely new to this and have not read other posts, this article may not help much and may even make things more confusing. Please read with care.

## Resources

### Firmware

- [ImmortalWrt official firmware](https://firmware-selector.immortalwrt.org/?version=24.10.2&target=mediatek%2Ffilogic&id=cmcc_rax3000m)
- [hanwckf/immortalwrt-mt798x](https://github.com/hanwckf/immortalwrt-mt798x): hanwckf's modified ImmortalWrt, based on ImmortalWrt 21.02

The main difference is that hanwckf has done a lot of optimization for the 798x series. If the router is only used as a hardware router, I personally recommend hanwckf's modified ImmortalWrt more.

### uboot

- [ImmortalWrt official firmware page](https://firmware-selector.immortalwrt.org/?version=24.10.2&target=mediatek%2Ffilogic&id=cmcc_rax3000m)
- [hanwckf/bl-mt798x](https://github.com/hanwckf/bl-mt798x/): uboot from hanwckf

If you want to try the latest ImmortalWrt, use the official ImmortalWrt uboot. hanwckf's uboot is also known in the community as an "unbrickable" uboot and has a strong reputation, but it does not support the official itb firmware format. It is more suitable for hanwckf's modified ImmortalWrt, or official ImmortalWrt 23.05.4 and earlier.

### Flashing Tools

Tools needed:

- SSH client
- A TFTP server, such as tftpd

## Flashing Process

### Flash Official ImmortalWrt

1. Unlock SSH.
2. Connect to the router through SSH.
3. Flash uboot.
4. Use tftpd to flash `immortalwrt-mediatek-filogic-cmcc_rax3000m-initramfs-recovery.itb`. This is a Linux kernel with a minimal root filesystem, suitable for first installation or recovery. If your firmware file has another name, rename it to the name above.
5. Open `http://192.168.1.1` in a browser.
6. Go to "System - Backup / Flash Firmware - Flash new firmware image", then choose the official `cmcc_rax3000m-squashfs-sysupgrade.itb`.
7. Wait for it to finish.

### About the BL2 Partition

On my CMCC RAX3000M, the usual process would be to flash uboot, then flash the `BL2` partition, and then flash the recovery firmware again. However, under China Mobile's official firmware, the `BL2` partition is locked. I did not flash it and instead flashed the recovery firmware directly through TFTP. This effectively skipped writing the `BL2` partition, and I did not notice obvious errors afterward.

After successfully flashing ImmortalWrt, you can use the kernel module `kmod-mtd-rw` to unlock and then flash the `BL2` partition. This issue bothered me for quite a while.

::: callout warning
Skipping the `BL2` write has potential risk. Make sure your own device and version are compatible before deciding. For details, see the ImmortalWrt [PR description](https://github.com/immortalwrt/immortalwrt/pull/1075), and rely on the information provided by the code contributors.
:::

### hanwckf's Modified ImmortalWrt

1. Unlock SSH.
2. Flash uboot.
3. Set your computer's network card to the fixed IP `192.168.1.254`, with gateway `192.168.1.1`.
4. Open `http://192.168.1.1` in a browser.
5. Choose firmware with a `bin` suffix, or another compatible firmware image.
6. Wait for upload and verification to finish. The web page will show a waiting-for-reboot screen.
7. Wait for completion.

## Network Settings

hanwckf's modified firmware includes many network driver optimizations, so it is closer to working out of the box. If you choose the official ImmortalWrt firmware, tune it according to your own network environment.

### My Network Configuration

I use AdGuard Home and OpenClash:

- AdGuard Home takes over Dnsmasq's port 53.
- AdGuard Home has only `127.0.0.1:7874` as its upstream server.
- OpenClash handles DNS resolution and traffic routing.

The overall path is roughly:

```text
Client device
  -> ImmortalWrt router
  -> AdGuard Home DNS handling
  -> OpenClash DNS resolution
  -> OpenClash traffic routing
  -> Direct access / proxy access
```

## Welcome to Discuss

If you have any questions about this note, feel free to discuss them.
