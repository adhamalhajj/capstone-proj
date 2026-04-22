// api/test-moderation/route.js
import { moderateImageBytes } from "../../lib/rekognitionModeration.js";

export async function POST() {
  return NextResponse.json({
    creds: !!process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
    labels: process.env.AWS_REKOGNITION_BLOCK_LABELS,
    status: "ready"
  });
}