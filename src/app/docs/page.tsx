'use client';

import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { Copy, Check, Database, Server, Container, Terminal, Settings, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function DocsPage() {
    const [activeTab, setActiveTab] = useState<'docker' | 'manual'>('docker');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Hero */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-4">Self-Hosting Guide</h1>
                        <p className="text-xl text-muted-foreground">
                            Deploy ApiClient on your own infrastructure in minutes.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Prerequisites */}
                        <section>
                            <SectionHeader icon={Settings} number={1} title="Prerequisites" />
                            <div className="glass-card p-6 rounded-xl">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-2 font-medium">Requirement</th>
                                            <th className="text-center py-2 font-medium">Docker</th>
                                            <th className="text-center py-2 font-medium">Manual</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-border/50">
                                            <td className="py-2">Docker & Docker Compose</td>
                                            <td className="text-center py-2 text-green-500">✓</td>
                                            <td className="text-center py-2 text-muted-foreground">—</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2">Node.js 18+</td>
                                            <td className="text-center py-2 text-muted-foreground">—</td>
                                            <td className="text-center py-2 text-green-500">✓</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2">PostgreSQL 16+</td>
                                            <td className="text-center py-2 text-violet-500">Included</td>
                                            <td className="text-center py-2 text-green-500">✓</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2">Redis 7+</td>
                                            <td className="text-center py-2 text-violet-500">Included</td>
                                            <td className="text-center py-2 text-green-500">✓</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Cloudinary Account</td>
                                            <td className="text-center py-2 text-green-500">✓</td>
                                            <td className="text-center py-2 text-green-500">✓</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Environment Variables */}
                        <section>
                            <SectionHeader icon={Database} number={2} title="Environment Variables" />
                            <p className="mb-4 text-muted-foreground">
                                Create a <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-sm">.env</code> file in the project root:
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
# CLOUDINARY (File Uploads)
# ===========================================
# Get from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ===========================================
# OPTIONAL: Google OAuth
# ===========================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""`}
                            />
                        </section>

                        {/* Deployment Methods */}
                        <section>
                            <SectionHeader icon={Container} number={3} title="Choose Your Deployment" />

                            {/* Tabs */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setActiveTab('docker')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'docker'
                                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                                            : 'glass hover:bg-accent'
                                        }`}
                                >
                                    <Container className="w-4 h-4 inline mr-2" />
                                    Docker (Recommended)
                                </button>
                                <button
                                    onClick={() => setActiveTab('manual')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'manual'
                                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                                            : 'glass hover:bg-accent'
                                        }`}
                                >
                                    <Server className="w-4 h-4 inline mr-2" />
                                    Manual VPS
                                </button>
                            </div>

                            {/* Docker Tab */}
                            {activeTab === 'docker' && (
                                <div className="space-y-6">
                                    <div className="glass-card p-4 rounded-xl border-l-4 border-violet-500">
                                        <p className="text-sm">
                                            <strong>Full Stack:</strong> Uses <code className="bg-muted px-1 rounded font-mono text-xs">docker-compose.full.yml</code> which includes PostgreSQL and Redis containers.
                                        </p>
                                    </div>

                                    <StepBlock title="Clone the repository">
                                        <CodeBlock code={`git clone https://github.com/yourusername/api-client.git
cd api-client`} />
                                    </StepBlock>

                                    <StepBlock title="Create your .env file">
                                        <p className="text-sm text-muted-foreground mb-2">Copy the environment variables from Step 2 above.</p>
                                    </StepBlock>

                                    <StepBlock title="Start all services">
                                        <CodeBlock code={`docker-compose -f docker-compose.full.yml up -d`} />
                                        <p className="text-sm text-muted-foreground mt-2">This starts PostgreSQL, Redis, and the app.</p>
                                    </StepBlock>

                                    <StepBlock title="Access the app">
                                        <p className="text-sm text-muted-foreground">
                                            Open <a href="http://localhost:3000" className="text-violet-500 hover:underline">http://localhost:3000</a> in your browser.
                                        </p>
                                    </StepBlock>

                                    <div className="mt-8">
                                        <h4 className="font-medium mb-3">Useful Commands</h4>
                                        <CodeBlock code={`# View logs
docker-compose -f docker-compose.full.yml logs -f

# Stop services
docker-compose -f docker-compose.full.yml down

# Rebuild after updates
docker-compose -f docker-compose.full.yml up -d --build`} />
                                    </div>
                                </div>
                            )}

                            {/* Manual Tab */}
                            {activeTab === 'manual' && (
                                <div className="space-y-6">
                                    <StepBlock title="Install prerequisites (Ubuntu/Debian)">
                                        <CodeBlock code={`# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Redis
sudo apt-get install -y redis-server
sudo systemctl enable redis-server`} />
                                    </StepBlock>

                                    <StepBlock title="Setup PostgreSQL database">
                                        <CodeBlock code={`sudo -u postgres psql

# In PostgreSQL shell:
CREATE USER apiclient WITH PASSWORD 'your-password';
CREATE DATABASE apiclient OWNER apiclient;
\\q`} />
                                    </StepBlock>

                                    <StepBlock title="Clone and install dependencies">
                                        <CodeBlock code={`git clone https://github.com/yourusername/api-client.git
cd api-client
npm ci`} />
                                    </StepBlock>

                                    <StepBlock title="Configure environment">
                                        <p className="text-sm text-muted-foreground mb-2">Create <code className="bg-muted px-1 rounded font-mono text-xs">.env</code> with your database URL:</p>
                                        <CodeBlock code={`DATABASE_URL="postgresql://apiclient:your-password@localhost:5432/apiclient"`} />
                                    </StepBlock>

                                    <StepBlock title="Build and run with PM2">
                                        <CodeBlock code={`# Build
npm run build

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start npm --name "api-client" -- start

# Auto-restart on reboot
pm2 save && pm2 startup`} />
                                    </StepBlock>
                                </div>
                            )}
                        </section>

                        {/* Troubleshooting */}
                        <section>
                            <SectionHeader icon={AlertCircle} number={4} title="Troubleshooting" />
                            <div className="glass-card rounded-xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="text-left p-4 font-medium">Issue</th>
                                            <th className="text-left p-4 font-medium">Solution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-border/50">
                                            <td className="p-4">Build fails with env errors</td>
                                            <td className="p-4">Ensure all required vars are in <code className="bg-muted px-1 rounded font-mono text-xs">.env</code></td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="p-4">Cannot connect to database</td>
                                            <td className="p-4">Check DATABASE_URL format and credentials</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="p-4">Port 3000 in use</td>
                                            <td className="p-4">Change port mapping in docker-compose</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4">Container keeps restarting</td>
                                            <td className="p-4">Check logs: <code className="bg-muted px-1 rounded font-mono text-xs">docker-compose logs api-client</code></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function SectionHeader({ icon: Icon, number, title }: { icon: typeof Database; number: number; title: string }) {
    return (
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {number}
            </span>
            <Icon className="w-5 h-5 text-muted-foreground" />
            {title}
        </h2>
    );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            {children}
        </div>
    );
}

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e]">
            {filename && (
                <div className="px-4 py-2 border-b border-border/30 text-xs text-muted-foreground bg-[#252525]">
                    {filename}
                </div>
            )}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Copy code"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-sm text-[#d4d4d4] whitespace-pre">
                    {code}
                </pre>
            </div>
        </div>
    );
}
