import { Company } from "@/models/CompanySchema";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateCompany(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Authentication required", success: false },
        { status: 401 }
      ),
    };
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as { companyId: string };

    const company = await Company.findById(decoded.companyId).select(
      "-password"
    );

    if (!company) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Company not found", success: false },
          { status: 404 }
        ),
      };
    }

    return { success: true, company };
  } catch (error) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Invalid or expired token", success: false },
        { status: 401 }
      ),
    };
  }
}
