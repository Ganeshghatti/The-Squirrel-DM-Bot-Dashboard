import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { Company } from "@/models/CompanySchema";
import { sendUserRegistrationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    const { name, phone, email, password } = body;

    if (!name || !phone || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({
      email: email.toLowerCase(),
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company already exists with this email" },
        { status: 409 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new company object

    function generateCompanyId(name: string): string {
      const namePart = name.replace(/\s+/g, "").toLowerCase().slice(0, 5);
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      return `${namePart}_${randomNum}`;
    }

    const newCompany = new Company({
      name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      company_id: generateCompanyId(name),
      company_instagram_id: Math.floor(
        10000000000000000 + Math.random() * 90000000000000000
      ).toString(),
      instagram_profile: "https://www.instagram.com/ganeshghatti",
      FAQ: [],
      bot_identity:
        "You're Ganesh, Founder of The Squirrel which is an AI automation agency.",
      Back_context:
        "Ganesh is the founder of The Squirrel, a tech company that builds smart AI automations to help businesses save time and grow faster. He recently automated his own Instagram DMs and now helps others do the same. Ganesh offers a free discovery call to business owners interested in Instagram automation or other business automations. People often DM the word “Automation” to learn more. Your job is to start a warm conversation, ask a couple of quick questions to see if they’re a good fit, collect their name and email, and then share Ganesh’s Calendly link if they’re interested",
      Role: "When someone messages “Automation,” thank them, introduce Ganesh briefly, and ask if they’re up for a quick chat before getting the link. Then ask 2 simple questions (one at a time), collect name + email, trigger the lead capture automation, and then share the Calendly link.",
      Conversation_Flow:
        "User messages “Automation”\n Thank them for reaching out\n Introduce Ganesh and The Squirrel\n Ask: “Are you open to a quick chat before I send you the call link?”\n\nIf yes:\nQuestion 1: “Are you looking for Instagram automation for your business?”\nQuestion 2: “Do you want help with any other automations in your business (like lead capture, WhatsApp flows, AI replies, etc.)?”\n Ask for their first name\n Ask for their email\n Trigger Google Sheets capture\n Share Ganesh’s Calendly link : https://calendly.com/ganeshghatti/discovery-call\n\nIf not interested:\nPolitely thank them and let them know they can always reach out later if they’re curious about automation.",
      isBotActive: true,
      keywords: ["automation", "ai", "automate"],
      access_token:
        "IGAAJZCDeZCjlzFBZAE1TT1BZASTNPQzI4WkRzMW9wZAG94ZAkdFTVN0UlhxSmEtMUVZAYV95cTRCTDlWUFlXT0JaYXhsanBsNEVDNHNhY3FuQzVVaTZAudzNzX3otektteHpoMjAzZAFFuR2p2d0d4NncxMU81NkNNbFVzeWEwUWRibDB0QQZDZD",
    }); // Save the company to the database
    await newCompany.save();

    // Send registration email notification
    await sendUserRegistrationEmail({
      name,
      email,
      phone,
      company_id: newCompany.company_id,
    });

    // Generate JWT token
    const token = jwt.sign(
      { companyId: newCompany._id },
      process.env.JWT_SECRET ||
        "d242e5eee67f713b47daee9117e604fdff9e8f6f43f87cd66af106ac23d575bc400ce7cd3033bb553011220a106fa5fc8e38a801b6ad052bd3863cbf4e708f739f60d67a4641ddcad348da2e3fe5a7c1ace3291f902760c3a6b5a213d4665ec1752f100404c89fb49803d9e1373291451d94a880e59850d5421b2f1cab125a858a68bd1975ca165953ac817f63831ce9fae5c82f09b55ebd7c7c16e499d8422789d7700349d99a223ceb9214905301726de81ea7e7352bdfa753b41d5b092971de0acbf22e7af07f0e87a5878b7858a51f06fdfe606cff84d8b14fc097cb7f097bd3de360574e75eb7a8279c7f4904044e9700487a856eed6493a05dfe92b604",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Company created successfully",
        token,
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating company:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Company already exists with this email" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
