import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "what-is-my-ip-address",
  title: "What Is My IP Address? Public vs Private Explained",
  description:
    "What is an IP address, and what's the difference between your public and private IP? How to find your IP and why it changes — explained simply.",
  keywords: [
    "what is my ip address",
    "what is an ip address",
    "public vs private ip",
    "how to find my ip",
    "why does my ip change",
  ],
  date: "2026-08-13",
  readingMinutes: 4,
  tags: ["Networking", "Developer"],
  related: ["what-is-my-ip", "cidr-calculator", "wifi-qr"],
};

export function Body() {
  return (
    <>
      <p>
        An <strong>IP address</strong> (Internet Protocol address) is a unique number that identifies a device
        on a network. It&apos;s how data finds its way back to you — when you load a page, the server needs your
        IP to know where to send the response.
      </p>

      <h2>See your IP right now</h2>
      <p>
        The quickest way to find yours is our <Link href="/tools/what-is-my-ip">What Is My IP tool</Link>. It
        shows your public IP instantly, along with your browser, operating system, screen size, and timezone —
        all read from the request your browser already sends, with nothing stored.
      </p>

      <h2>Public vs private IP</h2>
      <p>
        You actually have two kinds of IP address, and they serve different purposes:
      </p>
      <ul>
        <li>
          <strong>Public IP</strong> — assigned by your internet provider and visible to every website you
          visit. This is the address our tool shows. Everyone on your home network usually shares one public IP.
        </li>
        <li>
          <strong>Private IP</strong> — assigned by your router to each device inside your home or office (they
          usually start with 192.168, 10., or 172.16–31). These aren&apos;t visible on the public internet.
        </li>
      </ul>

      <h2>IPv4 vs IPv6</h2>
      <p>
        The older <strong>IPv4</strong> format looks like <code>203.0.113.42</code> — four numbers separated by
        dots. Because the world ran out of IPv4 addresses, <strong>IPv6</strong> was introduced; it&apos;s
        longer and uses colons, like <code>2001:0db8:85a3::8a2e:0370:7334</code>. Our tool labels which one
        you&apos;re using.
      </p>

      <h2>Why does my IP keep changing?</h2>
      <p>
        Most home connections use a <strong>dynamic IP</strong> that your provider can reassign periodically or
        after a router reboot. Switching networks (Wi-Fi to mobile data), or using a <strong>VPN</strong> or
        proxy, will also change the public IP that websites see.
      </p>

      <h2>FAQ</h2>
      <h3>Is it safe to share my IP address?</h3>
      <p>
        An IP alone reveals only rough location (city-level) and your provider — not your name or exact address.
        Still, avoid posting it publicly, and use a VPN if you want to mask it.
      </p>
      <h3>How do I find my private (local) IP?</h3>
      <p>
        Check your device&apos;s network settings — on Windows run <code>ipconfig</code>, and on macOS or Linux
        run <code>ifconfig</code> or <code>ip addr</code>. Websites can&apos;t see this address.
      </p>
      <h3>Does a VPN change my IP?</h3>
      <p>Yes — a VPN routes your traffic through its server, so sites see the VPN&apos;s IP instead of yours.</p>
    </>
  );
}
