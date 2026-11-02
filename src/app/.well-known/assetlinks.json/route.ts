import { NextResponse } from 'next/server';

export async function GET() {
  const assetlinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.immobillis.www.twa",
        sha256_cert_fingerprints: [
          "B5:18:6B:19:D4:BA:F3:D5:CD:53:C5:3F:83:8D:17:F1:C9:80:C1:FD:2D:E9:9D:61:94:07:95:C9:1C:17:74:F2",
          "50:90:3F:BE:03:7F:32:04:88:80:0F:78:E9:53:56:5D:87:66:34:64:C3:FF:11:47:04:D2:C3:B6:3B:5F:AA:C1"
        ]
      }
    },
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.immobillis.twa",
        sha256_cert_fingerprints: [
          "B5:18:6B:19:D4:BA:F3:D5:CD:53:C5:3F:83:8D:17:F1:C9:80:C1:FD:2D:E9:9D:61:94:07:95:C9:1C:17:74:F2",
          "50:90:3F:BE:03:7F:32:04:88:80:0F:78:E9:53:56:5D:87:66:34:64:C3:FF:11:47:04:D2:C3:B6:3B:5F:AA:C1"
        ]
      }
    }
  ];

  return NextResponse.json(assetlinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

