import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";

/**
 * Shared email utility using Microsoft Graph API for Strategic Value Plus.
 * Sends emails as nelinia@strategicvalueplus.com via Azure AD app registration.
 *
 * Required environment variables:
 *   AZURE_TENANT_ID    - Azure AD tenant (directory) ID
 *   AZURE_CLIENT_ID    - App registration application (client) ID
 *   AZURE_CLIENT_SECRET - App registration client secret value
 *   SMTP_FROM_EMAIL    - Sender email address (default: nelinia@strategicvalueplus.com)
 *   SMTP_FROM_NAME     - Sender display name (default: "Strategic Value+")
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Create a Microsoft Graph client using client credentials flow.
 */
function createGraphClient(): Client | null {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    console.warn(
      "Azure credentials not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET."
    );
    return null;
  }

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });

  return Client.initWithMiddleware({ authProvider });
}

/**
 * Get the configured "from" address for outgoing emails.
 */
export function getFromAddress(): string {
  const name = process.env.SMTP_FROM_NAME || "Strategic Value+";
  const email = process.env.SMTP_FROM_EMAIL || "nelinia@strategicvalueplus.com";
  return `${name} <${email}>`;
}

/**
 * Check if email sending is configured.
 */
export function isEmailConfigured(): boolean {
  return !!(
    process.env.AZURE_TENANT_ID &&
    process.env.AZURE_CLIENT_ID &&
    process.env.AZURE_CLIENT_SECRET
  );
}

/**
 * Send an email using Microsoft Graph API.
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const graphClient = createGraphClient();

  if (!graphClient) {
    return {
      success: false,
      error: "Azure credentials not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET.",
    };
  }

  const fromEmail = process.env.SMTP_FROM_EMAIL || "nelinia@strategicvalueplus.com";
  const fromName = process.env.SMTP_FROM_NAME || "Strategic Value+";

  // Build recipient list
  const toRecipients = (Array.isArray(options.to) ? options.to : [options.to]).map(
    (email) => ({
      emailAddress: { address: email },
    })
  );

  // Build the Graph API message payload
  const message: Record<string, unknown> = {
    message: {
      subject: options.subject,
      body: {
        contentType: "HTML",
        content: options.html,
      },
      from: {
        emailAddress: {
          address: fromEmail,
          name: fromName,
        },
      },
      toRecipients,
      ...(options.replyTo
        ? {
            replyTo: [
              {
                emailAddress: { address: options.replyTo },
              },
            ],
          }
        : {}),
    },
    saveToSentItems: true,
  };

  try {
    await graphClient
      .api(`/users/${fromEmail}/sendMail`)
      .post(message);

    console.log(`Email sent via Graph API to ${options.to}`);
    return {
      success: true,
      messageId: `graph_${Date.now()}`,
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown email error";
    console.error("Graph API email error:", errMessage);
    return {
      success: false,
      error: errMessage,
    };
  }
}
