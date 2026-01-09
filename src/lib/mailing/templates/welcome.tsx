import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  loginUrl?: string;
  appName?: string;
}

export function WelcomeEmail({
  userName,
  userEmail,
  loginUrl = "https://apistudio.dev/sign-in",
  appName = "API Studio",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {appName} - Let&apos;s get started!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Welcome to {appName}! 🚀</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>

            <Text style={paragraph}>
              Thank you for signing up! We&apos;re excited to have you on board.
              {appName} is your all-in-one solution for building, testing, and
              debugging APIs with an intuitive interface.
            </Text>

            <Text style={paragraph}>
              With your new account ({userEmail}), you can:
            </Text>

            <Section style={featureList}>
              <Text style={featureItem}>
                ✨ Build and test REST and WebSocket APIs
              </Text>
              <Text style={featureItem}>
                📁 Organize your work in workspaces and collections
              </Text>
              <Text style={featureItem}>
                👥 Collaborate with your team in real-time
              </Text>
              <Text style={featureItem}>
                🔐 Securely manage authentication and environments
              </Text>
            </Section>

            <Section style={buttonSection}>
              <Button style={button} href={loginUrl}>
                Get Started
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Need help? Just reply to this email or visit our{" "}
              <Link href="https://apistudio.dev/docs" style={link}>
                documentation
              </Link>
              .
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  maxWidth: "600px",
};

const header = {
  padding: "32px 48px 24px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
  padding: "0",
};

const content = {
  padding: "0 48px",
};

const greeting = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const featureList = {
  margin: "24px 0",
  padding: "20px 24px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const featureItem = {
  color: "#4a4a4a",
  fontSize: "15px",
  lineHeight: "28px",
  margin: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const link = {
  color: "#6366f1",
  textDecoration: "underline",
};

export default WelcomeEmail;
