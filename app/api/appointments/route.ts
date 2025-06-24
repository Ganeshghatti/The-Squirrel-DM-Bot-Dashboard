import { NextResponse } from "next/server";
import Appointment from "@/models/AppointmentSchema";
import { connectDB } from "@/lib/db";
import { authenticateCompany } from "@/lib/auth";
import { NextRequest } from "next/server";
import {
  sendAppointmentCreatedEmail,
  sendAppointmentUpdatedEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "phone",
      "date",
      "startTime",
      "service",
      "user_instagram_id",
      "company_instagram_id",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate date and time formats
    const date = new Date(body.date);
    const startTime = new Date(body.startTime);

    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (isNaN(startTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid time format" },
        { status: 400 }
      );
    }

    // // Validate that end time is after start time
    // if (endTime <= startTime) {
    //   return NextResponse.json(
    //     { error: "End time must be after start time" },
    //     { status: 400 }
    //   );
    // }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    } // Create new appointment
    const appointment = await Appointment.create(body);

    // Send email notification
    await sendAppointmentCreatedEmail(appointment);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    const authResult = await authenticateCompany(request);

    if (!authResult.success) return authResult.response;

    const company = authResult.company;

    // Get company_instagram_id from the user's session
    const companyInstagramId = company.company_instagram_id;

    if (!companyInstagramId) {
      return NextResponse.json(
        { error: "Company Instagram ID not found" },
        { status: 400 }
      );
    }
    console.log("Company Instagram ID:", companyInstagramId);
    console.log("Fetching appointments...");
    // Fetch appointments for the company
    const appointments = await Appointment.find({
      company_instagram_id: companyInstagramId,
    }).sort({ date: -1, startTime: -1 });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    const authResult = await authenticateCompany(request);
    if (!authResult.success) return authResult.response;

    const body = await request.json();
    const { appointmentId, ...updateData } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Validate date and time formats if provided
    if (updateData.date) {
      const date = new Date(updateData.date);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
    }

    if (updateData.startTime || updateData.endTime) {
      const startTime = updateData.startTime
        ? new Date(updateData.startTime)
        : null;
      const endTime = updateData.endTime ? new Date(updateData.endTime) : null;

      if (
        (startTime && isNaN(startTime.getTime())) ||
        (endTime && isNaN(endTime.getTime()))
      ) {
        return NextResponse.json(
          { error: "Invalid time format" },
          { status: 400 }
        );
      }

      // If both times are provided, validate that end time is after start time
      if (startTime && endTime && endTime <= startTime) {
        return NextResponse.json(
          { error: "End time must be after start time" },
          { status: 400 }
        );
      }
    }

    // Validate email format if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Validate phone number format if provided
    if (updateData.phone) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(updateData.phone)) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Send email notification
    await sendAppointmentUpdatedEmail(updatedAppointment);

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
