import { NextRequest, NextResponse } from "next/server";
import { fetchOpportunityDetails } from "@/lib/sam/samApiClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKey = process.env.SAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SAM.gov API key not configured" },
        { status: 500 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Notice ID is required" },
        { status: 400 }
      );
    }

    const opportunity = await fetchOpportunityDetails(id, apiKey);

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      opportunity,
    });
  } catch (error) {
    console.error("Error fetching opportunity details:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunity details", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
