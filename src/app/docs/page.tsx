"use client";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import {
  Copy,
  Check,
  Database,
  Server,
  Container,
  Settings,
  AlertCircle,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"docker" | "manual">("docker");
  const [activeSection, setActiveSection] = useState("prerequisites");

  // Scroll spy effect for sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "prerequisites",
        "env-vars",
        "deployment",
        "troubleshooting",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32 space-y-4">
                <div className="flex items-center gap-2 mb-6 text-foreground font-semibold">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Documentation</span>
                </div>
                <nav className="flex flex-col space-y-1">
                  {[
                    { id: "prerequisites", label: "1. Prerequisites" },
                    { id: "env-vars", label: "2. Configuration" },
                    { id: "deployment", label: "3. Deployment" },
                    { id: "troubleshooting", label: "4. Troubleshooting" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "px-4 py-2 text-sm rounded-lg transition-colors border-l-2",
                        activeSection === item.id
                          ? "bg-primary/10 text-primary border-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50 border-transparent hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="pt-6 border-t border-border mt-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                    Community
                  </p>
                  <a
                    href="https://github.com/rohittiwari-dev/api-client/issues"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    Report an Issue <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 max-w-4xl">
              {/* Page Title */}
              <div className="mb-12 border-b border-border pb-8">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
                  Self-Hosting Guide
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Deploy Api Studio on your own infrastructure with total
                  control. Choose between Docker or a manual VPS setup.
                </p>
              </div>

              <div className="space-y-16">
                {/* Prerequisites */}
                <section id="prerequisites" className="scroll-mt-32">
                  <SectionHeader
                    icon={Settings}
                    number={1}
                    title="Prerequisites"
                  />
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-6 py-4 font-semibold">
                              Requirement
                            </th>
                            <th className="text-center px-6 py-4 font-semibold text-primary">
                              Docker
                            </th>
                            <th className="text-center px-6 py-4 font-semibold text-primary">
                              Manual
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr>
                            <td className="px-6 py-4 font-medium">
                              Docker / Compose
                            </td>
                            <td className="text-center px-6 py-4 text-green-500">
                              <Check className="w-4 h-4 mx-auto" />
                            </td>
                            <td className="text-center px-6 py-4 text-muted-foreground">
                              —
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-medium">
                              Node.js 18+
                            </td>
                            <td className="text-center px-6 py-4 text-muted-foreground">
                              —
                            </td>
                            <td className="text-center px-6 py-4 text-green-500">
                              <Check className="w-4 h-4 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-medium">
                              PostgreSQL 16+
                            </td>
                            <td className="text-center px-6 py-4 text-blue-500 text-xs font-mono bg-blue-500/10 rounded-full px-2 py-0.5 inline-block">
                              INCLUDED
                            </td>
                            <td className="text-center px-6 py-4 text-green-500">
                              <Check className="w-4 h-4 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-medium">Redis 7+</td>
                            <td className="text-center px-6 py-4 text-blue-500 text-xs font-mono bg-blue-500/10 rounded-full px-2 py-0.5 inline-block">
                              INCLUDED
                            </td>
                            <td className="text-center px-6 py-4 text-green-500">
                              <Check className="w-4 h-4 mx-auto" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Environment Variables */}
                <section id="env-vars" className="scroll-mt-32">
                  <SectionHeader
                    icon={Database}
                    number={2}
                    title="Environment Variables"
                  />
                  <p className="mb-4 text-muted-foreground">
                    Create a{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-sm border border-border">
                      .env
                    </code>{" "}
                    file in the project root.
                  </p>
                  <CodeBlock
                    filename=".env"
                    code={`# ===========================================
# DATABASE
# ===========================================
# For docker-compose.full.yml, this is auto-configured
DATABASE_URL="postgresql://user:password@localhost:5432/apiclient"
POSTGRES_PASSWORD="your-secure-database-password"

# ===========================================
# APPLICATION
# ===========================================
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_WEB_PUBLIC_URL="http://localhost:3000"

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secret-key-here"

# ===========================================
# REDIS
# ===========================================
REDIS_URL="redis://localhost:6379"

# ===========================================
# OPTIONAL: Google OAuth
# ===========================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""`}
                  />
                </section>

                {/* Deployment Methods */}
                <section id="deployment" className="scroll-mt-32">
                  <SectionHeader
                    icon={Container}
                    number={3}
                    title="Choose Deployment"
                  />

                  {/* Tabs */}
                  <div className="flex p-1 bg-muted rounded-xl mb-8 w-fit border border-border">
                    <button
                      onClick={() => setActiveTab("docker")}
                      className={cn(
                        "px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                        activeTab === "docker"
                          ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Container className="w-4 h-4" />
                      Docker (Recommended)
                    </button>
                    <button
                      onClick={() => setActiveTab("manual")}
                      className={cn(
                        "px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                        activeTab === "manual"
                          ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Server className="w-4 h-4" />
                      Manual VPS
                    </button>
                  </div>

                  {/* Docker Tab */}
                  {activeTab === "docker" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                          <Container className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                            Full Stack Deployment
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300/80 mt-1">
                            We use{" "}
                            <code className="bg-blue-500/10 px-1 rounded text-xs font-mono">
                              docker-compose.full.yml
                            </code>{" "}
                            to spin up the App, Postgres, and Redis
                            automatically.
                          </p>
                        </div>
                      </div>

                      <StepBlock number={1} title="Clone the repository">
                        <CodeBlock
                          language="bash"
                          code={`git clone https://github.com/yourusername/api-client.git
cd api-client`}
                        />
                      </StepBlock>

                      <StepBlock number={2} title="Create .env file">
                        <p className="text-muted-foreground mb-3 text-sm">
                          Copy the variables from the Configuration section
                          above.
                        </p>
                      </StepBlock>

                      <StepBlock number={3} title="Star services">
                        <CodeBlock
                          language="bash"
                          code={`docker-compose -f docker-compose.full.yml up -d`}
                        />
                        <p className="text-sm text-muted-foreground mt-3">
                          🎉 Access your app at{" "}
                          <a
                            href="http://localhost:3000"
                            className="text-primary hover:underline"
                          >
                            http://localhost:3000
                          </a>
                        </p>
                      </StepBlock>

                      <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                          Useful Commands
                        </h4>
                        <CodeBlock
                          language="bash"
                          code={`# View logs
docker-compose -f docker-compose.full.yml logs -f

# Stop services
docker-compose -f docker-compose.full.yml down

# Rebuild after updates
docker-compose -f docker-compose.full.yml up -d --build`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Manual Tab */}
                  {activeTab === "manual" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <StepBlock number={1} title="Install system dependencies">
                        <CodeBlock
                          language="bash"
                          code={`# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL & Redis
sudo apt-get install -y postgresql postgresql-contrib redis-server`}
                        />
                      </StepBlock>

                      <StepBlock number={2} title="Setup Database">
                        <CodeBlock
                          language="sql"
                          code={`sudo -u postgres psql

-- Inside psql shell:
CREATE USER apiclient WITH PASSWORD 'your-password';
CREATE DATABASE apiclient OWNER apiclient;
\\q`}
                        />
                      </StepBlock>

                      <StepBlock number={3} title="Install Application">
                        <CodeBlock
                          language="bash"
                          code={`git clone https://github.com/yourusername/api-client.git
cd api-client
npm ci
npm run build`}
                        />
                      </StepBlock>

                      <StepBlock number={4} title="Start with PM2">
                        <CodeBlock
                          language="bash"
                          code={`npm install -g pm2
pm2 start npm --name "api-client" -- start
pm2 save && pm2 startup`}
                        />
                      </StepBlock>
                    </motion.div>
                  )}
                </section>

                {/* Troubleshooting */}
                <section id="troubleshooting" className="scroll-mt-32">
                  <SectionHeader
                    icon={AlertCircle}
                    number={4}
                    title="Troubleshooting"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border p-5 rounded-xl">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Build fails with env errors
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure all required vars are present in .env. Check for
                        typos in variable names.
                      </p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-xl">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Database Connection Failed
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Verify <code>DATABASE_URL</code> format. Ensure Postgres
                        service is running on port 5432.
                      </p>
                    </div>
                    <div className="bg-card border border-border p-5 rounded-xl">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Port 3000 in use
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Change the port mapping in docker-compose.yml, e.g.,{" "}
                        <code>&quot;3001:3000&quot;</code>.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  number,
  title,
}: {
  icon: typeof Database;
  number: number;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg">
        {number}
      </div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function StepBlock({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative border-l-2 border-border pl-6 ml-3 py-1">
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-border ring-4 ring-background" />
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function CodeBlock({
  code,
  filename,
  language = "text",
}: {
  code: string;
  filename?: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-xl overflow-hidden bg-[#0f1117] border border-border/40 shadow-xl">
      {filename && (
        <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">
            {filename}
          </span>
          <span className="text-xs text-muted-foreground/50 uppercase">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="absolute right-3 top-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        <div className="p-5 overflow-x-auto custom-scrollbar">
          <pre className="font-mono text-sm leading-relaxed text-[#e6edf3]">
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}
