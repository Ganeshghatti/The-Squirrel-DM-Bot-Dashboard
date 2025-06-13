import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Company } from "@/models/CompanySchema";
// import { ChatHistory } from "@/models/ChatHistorySchema";
import Conversation from "@/models/ConversationSchema";
import { authenticateCompany } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const requiredFields = [
      "company_instagram_id",
      "email",
      "password",
      "name",
      "bot_identity",
      "Back_context",
      "Role",
      "Conversation_Flow",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required`, success: false },
          { status: 400 }
        );
      }
    }

    const baseSlug = slugify(body.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure uniqueness of the slug
    while (await Company.findOne({ company_id: slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const existingCompany = await Company.findOne({
      $or: [
        { email: body.email },
        { company_instagram_id: body.company_instagram_id },
      ],
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company already exists", success: false },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const company = new Company({
      ...body,
      company_id: slug,
      password: hashedPassword,
    });

    await company.save();

    return NextResponse.json(
      { message: "Company registered successfully", success: true, company },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const company = await Company.find().select("-password");

    return NextResponse.json({ company, success: true }, { status: 200 });
  } catch (error) {
    console.error("Companies Not Found error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const authResult = await authenticateCompany(request);

    if (!authResult.success) return authResult.response;

    const company = authResult.company;

    const updateFields = {
      instagram_profile: body.instagram_profile,
      phone: body.phone,
      name: body.name,
      FAQ: body.FAQ,
      bot_identity: body.bot_identity,
      Back_context: body.Back_context,
      Role: body.Role,
      Conversation_Flow: body.Conversation_Flow,
      isBotActive: body.isBotActive,
    };

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    // Fields that can be updated

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        updatedCompany,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateCompany(request);

    if (!authResult.success) return authResult.response;

    const company = authResult.company;

    // Delete the company
    await Company.findByIdAndDelete(company._id);

    await Conversation.deleteMany({
      company_instagram_id: company.company_instagram_id,
    });

    return NextResponse.json(
      {
        message: "Company and associated chat history deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Company delete error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
