import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "cidr-subnet-cheat-sheet",
  title: "CIDR & Subnet Cheat Sheet: /24, /29, /30 Explained",
  description:
    "A plain-English CIDR cheat sheet — what each prefix (/24, /29, /30, /32) means, its subnet mask, and how many hosts it holds, with a free calculator.",
  keywords: [
    "cidr cheat sheet",
    "subnet cheat sheet",
    "cidr notation explained",
    "/30 subnet",
    "cidr to subnet mask",
  ],
  date: "2026-07-22",
  readingMinutes: 6,
  tags: ["Networking", "Developer"],
  related: ["cidr-calculator", "number-base-converter", "chmod-calculator"],
};

const ROWS = [
  { cidr: "/24", mask: "255.255.255.0", hosts: "254", total: "256" },
  { cidr: "/25", mask: "255.255.255.128", hosts: "126", total: "128" },
  { cidr: "/26", mask: "255.255.255.192", hosts: "62", total: "64" },
  { cidr: "/27", mask: "255.255.255.224", hosts: "30", total: "32" },
  { cidr: "/28", mask: "255.255.255.240", hosts: "14", total: "16" },
  { cidr: "/29", mask: "255.255.255.248", hosts: "6", total: "8" },
  { cidr: "/30", mask: "255.255.255.252", hosts: "2", total: "4" },
  { cidr: "/31", mask: "255.255.255.254", hosts: "2*", total: "2" },
  { cidr: "/32", mask: "255.255.255.255", hosts: "1", total: "1" },
];

export function Body() {
  return (
    <>
      <p>
        CIDR (Classless Inter-Domain Routing) notation is the modern way to describe an IP range. You
        write an address, a slash, and a number — like <code>192.168.1.0/24</code>. That number is
        the <strong>prefix length</strong>: how many leading bits are fixed as the network portion.
        The rest are free for hosts. This guide breaks it down and gives you a cheat sheet you can
        bookmark.
      </p>

      <h2>How to read a prefix</h2>
      <p>
        An IPv4 address has 32 bits. The prefix says how many are &quot;locked&quot; to the network.
        A <code>/24</code> locks 24 bits, leaving 8 bits (2⁸ = 256 addresses) for hosts. A{" "}
        <code>/30</code> locks 30 bits, leaving just 2 bits (4 addresses). The higher the number, the
        smaller the network.
      </p>
      <p>
        Two addresses in every normal subnet are reserved: the first is the <em>network address</em>{" "}
        and the last is the <em>broadcast address</em>. That&apos;s why a /24 holds 256 addresses but
        only 254 <em>usable</em> hosts.
      </p>

      <h2>CIDR cheat sheet</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-medium">CIDR</th>
              <th className="py-2 pr-4 font-medium">Subnet mask</th>
              <th className="py-2 pr-4 font-medium">Usable hosts</th>
              <th className="py-2 font-medium">Total addresses</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {ROWS.map((r) => (
              <tr key={r.cidr} className="border-b border-border/50">
                <td className="py-2 pr-4">{r.cidr}</td>
                <td className="py-2 pr-4">{r.mask}</td>
                <td className="py-2 pr-4">{r.hosts}</td>
                <td className="py-2">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        * A /31 has no network/broadcast reservation and is used for point-to-point links (RFC 3021),
        so both addresses are usable.
      </p>

      <h2>Worked example: /29</h2>
      <p>
        Say you&apos;re given <code>10.0.0.0/29</code>. The mask is 255.255.255.248, the block size is
        8 addresses, so this subnet covers <code>10.0.0.0</code>–<code>10.0.0.7</code>:
      </p>
      <ul>
        <li>Network address: <code>10.0.0.0</code></li>
        <li>Usable hosts: <code>10.0.0.1</code>–<code>10.0.0.6</code> (6 hosts)</li>
        <li>Broadcast address: <code>10.0.0.7</code></li>
      </ul>
      <p>
        The next subnet starts at <code>10.0.0.8/29</code>, and so on in steps of 8.
      </p>

      <h2>The fast way to do this</h2>
      <p>
        You don&apos;t have to work out the mask and range by hand. Paste any address and prefix into
        our free <Link href="/tools/cidr-calculator">CIDR / subnet calculator</Link> and it instantly
        shows the network, broadcast, usable host range, mask, wildcard, and host counts.
      </p>
      <p>
        Want to understand the bit math behind it? The{" "}
        <Link href="/tools/number-base-converter">number base converter</Link> is handy for seeing how
        a subnet mask looks in binary.
      </p>

      <h2>Quick reference: block size trick</h2>
      <p>
        To find where subnets start, compute the block size as{" "}
        <code>256 − (last mask octet)</code>. For /26 the mask ends in 192, so 256 − 192 = 64 — subnets
        begin at .0, .64, .128, .192. This trick works for any prefix once you know the mask.
      </p>
    </>
  );
}
