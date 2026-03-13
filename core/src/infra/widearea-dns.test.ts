import { describe, expect, it } from "vitest";
import { renderWideAreaGatewayZoneText } from "./widearea-dns.js";

describe("wide-area DNS-SD zone rendering", () => {
  it("renders a zone with gateway PTR/SRV/TXT records", () => {
    const txt = renderWideAreaGatewayZoneText({
      domain: "ultraclaw.internal.",
      serial: 2025121701,
      gatewayPort: 18790,
      displayName: "Mac Studio (UltraClaw)",
      tailnetIPv4: "100.123.224.76",
      tailnetIPv6: "fd7a:115c:a1e0::8801:e04c",
      hostLabel: "studio-london",
      instanceLabel: "studio-london",
      sshPort: 22,
      cliPath: "/opt/homebrew/bin/ultraclaw",
    });

    expect(txt).toContain(`$ORIGIN ultraclaw.internal.`);
    expect(txt).toContain(`studio-london IN A 100.123.224.76`);
    expect(txt).toContain(`studio-london IN AAAA fd7a:115c:a1e0::8801:e04c`);
    expect(txt).toContain(`_ultraclaw-gw._tcp IN PTR studio-london._ultraclaw-gw._tcp`);
    expect(txt).toContain(`studio-london._ultraclaw-gw._tcp IN SRV 0 0 18790 studio-london`);
    expect(txt).toContain(`displayName=Mac Studio (UltraClaw)`);
    expect(txt).toContain(`gatewayPort=18790`);
    expect(txt).toContain(`sshPort=22`);
    expect(txt).toContain(`cliPath=/opt/homebrew/bin/ultraclaw`);
  });

  it("includes tailnetDns when provided", () => {
    const txt = renderWideAreaGatewayZoneText({
      domain: "ultraclaw.internal.",
      serial: 2025121701,
      gatewayPort: 18790,
      displayName: "Mac Studio (UltraClaw)",
      tailnetIPv4: "100.123.224.76",
      tailnetDns: "peters-mac-studio-1.sheep-coho.ts.net",
      hostLabel: "studio-london",
      instanceLabel: "studio-london",
    });

    expect(txt).toContain(`tailnetDns=peters-mac-studio-1.sheep-coho.ts.net`);
  });
});
