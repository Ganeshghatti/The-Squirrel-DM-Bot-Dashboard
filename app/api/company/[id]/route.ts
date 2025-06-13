import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Company } from "@/models/CompanySchema";
import { authenticateCompany } from "@/lib/auth";

// Use Next.js's built-in type for dynamic route parameters
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid company ID" }, { status: 400 });
  }

  try {
    const company = await Company.findById(id);

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  // Authenticate the request
  const authResult = await authenticateCompany(req);
  if (!authResult.success) {
    return authResult.response;
  }

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid company ID" }, { status: 400 });
  }

  // Verify that the authenticated company matches the ID being updated
  if (authResult.company._id.toString() !== id) {
    return NextResponse.json(
      { error: "Unauthorized to update this company" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { isBotActive } = body;

    if (typeof isBotActive !== "boolean") {
      return NextResponse.json(
        { error: "isBotActive must be a boolean value" },
        { status: 400 }
      );
    }

    const company = await Company.findByIdAndUpdate(
      id,
      { isBotActive },
      { new: true, runValidators: true }
    );

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Bot ${isBotActive ? "activated" : "deactivated"} successfully`,
      company,
    });
  } catch (error) {
    console.error("Error updating bot status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
