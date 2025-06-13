import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductDetails } from "@/models/ProductDetailsSchema";
import { Company } from "@/models/CompanySchema";

// Validation helper function
function validateProductDetailsData(data: any) {
  const errors: string[] = [];

  if (!data.company_instagram_id) {
    errors.push("company_instagram_id is required");
  } else if (typeof data.company_instagram_id !== "string") {
    errors.push("company_instagram_id must be a string");
  } else if (data.company_instagram_id.trim().length === 0) {
    errors.push("company_instagram_id cannot be empty");
  }

  if (!data.text_content) {
    errors.push("text_content is required");
  } else if (typeof data.text_content !== "string") {
    errors.push("text_content must be a string");
  } else if (data.text_content.trim().length === 0) {
    errors.push("text_content cannot be empty");
  } else if (data.text_content.length > 5000) {
    errors.push("text_content cannot exceed 5000 characters");
  }

  return errors;
}

// POST - Create new product details
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate request body
    const validationErrors = validateProductDetailsData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    const { company_instagram_id, text_content } = body;

    // Check if company exists
    const company = await Company.findOne({ company_instagram_id });
    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: "Company not found with the provided Instagram ID",
        },
        { status: 404 }
      );
    }

    // Create new product details
    const productDetails = new ProductDetails({
      company_instagram_id: company_instagram_id.trim(),
      text_content: text_content.trim(),
    });

    const savedProductDetails = await productDetails.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product details created successfully",
        data: {
          id: savedProductDetails._id,
          company_instagram_id: savedProductDetails.company_instagram_id,
          text_content: savedProductDetails.text_content,
          createdAt: savedProductDetails.createdAt,
          updatedAt: savedProductDetails.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product details:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry detected",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product details",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve product details
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const companyInstagramId = searchParams.get("company_instagram_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "10", 10),
      100
    ); // Max 100 items per page
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Validate page and limit
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Page number must be greater than 0",
        },
        { status: 400 }
      );
    }

    if (limit < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Limit must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Build query
    const query: any = {};

    if (companyInstagramId) {
      // If specific company requested, verify it exists
      const company = await Company.findOne({
        company_instagram_id: companyInstagramId,
      });
      if (!company) {
        return NextResponse.json(
          {
            success: false,
            error: "Company not found with the provided Instagram ID",
          },
          { status: 404 }
        );
      }
      query.company_instagram_id = companyInstagramId;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Execute query with pagination
    const [productDetails, totalCount] = await Promise.all([
      ProductDetails.find(query).sort(sort).skip(skip).limit(limit).lean(),
      ProductDetails.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        success: true,
        data: productDetails,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching product details:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product details",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
