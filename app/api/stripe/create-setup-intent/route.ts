import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, customerName, signatureId } = await request.json();

    if (!customerEmail || !signatureId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName || customerEmail,
      metadata: {
        signatureId,
      },
    });

    // Create a setup intent for the customer
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
      metadata: {
        signatureId,
        customerEmail,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Error creating setup intent:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create payment setup", details: message },
      { status: 500 }
    );
  }
}
