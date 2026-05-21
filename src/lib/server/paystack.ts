import axios from "axios";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface InitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
  };
}

/**
 * Initialize a payment transaction with Paystack
 */
export async function initializePayment(
  email: string,
  amount: number,
  reference: string,
  currency = "GHS",
  metadata?: Record<string, unknown>
): Promise<InitializePaymentResponse> {
  try {
    const response = await axios.post<InitializePaymentResponse>(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        currency,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`,
        metadata: {
          cancel_action: `${process.env.NEXT_PUBLIC_APP_URL}/booking?cancelled=true`,
          ...metadata,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw new Error("Failed to initialize payment");
  }
}

/**
 * Verify a payment transaction with Paystack
 */
export async function verifyPayment(
  reference: string
): Promise<VerifyPaymentResponse> {
  try {
    const response = await axios.get<VerifyPaymentResponse>(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw new Error("Failed to verify payment");
  }
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `BOOKING-${timestamp}-${random}`;
}
