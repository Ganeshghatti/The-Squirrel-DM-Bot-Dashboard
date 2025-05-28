import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Company } from "@/models/CompanySchema";
import { authenticateCompany } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json(
        { error: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials", success: false },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { companyId: company._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { message: "Login successful", token, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateCompany(request);

    if (!authResult.success) return authResult.response;

    const company = authResult.company;

    return NextResponse.json({ company, success: true }, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
