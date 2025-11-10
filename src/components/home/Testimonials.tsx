'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Senior Backend Developer',
        company: 'TechCorp',
        avatar: 'SC',
        content:
            "ApiClient has completely transformed how I test APIs. The WebSocket support is incredible, and the UI is so much cleaner than other tools I've used.",
        rating: 5,
    },
    {
        name: 'Marcus Johnson',
        role: 'Full Stack Engineer',
        company: 'StartupXYZ',
        avatar: 'MJ',
        content:
            'Finally, an API client that looks as good as it works. The collections feature saves me hours every week. Highly recommended!',
        rating: 5,
    },
    {
        name: 'Emily Rodriguez',
        role: 'DevOps Lead',
        company: 'CloudScale',
        avatar: 'ER',
        content:
            'The environment switching is seamless. I can test across dev, staging, and prod without any hassle. Game changer for our team.',
        rating: 5,
    },
    {
        name: 'Alex Kim',
        role: 'API Developer',
        company: 'DataFlow',
        avatar: 'AK',
        content:
            "Been using this for GraphQL development and it's perfect. The query builder and response visualization are top-notch.",
        rating: 5,
    },
    {
        name: 'Jordan Taylor',
        role: 'Tech Lead',
        company: 'InnovateTech',
        avatar: 'JT',
        content:
            'Our entire team switched to ApiClient. The collaboration features and shared collections make API development so much smoother.',
        rating: 5,
    },
    {
        name: 'Priya Patel',
        role: 'Software Architect',
        company: 'BuildRight',
        avatar: 'PP',
        content:
            'The code generation feature alone is worth it. Export to any language in seconds. Beautiful interface too!',
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                        Loved by{' '}
                        <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                            developers
                        </span>{' '}
                        worldwide
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Join thousands of developers who have made ApiClient their go-to
                        tool for API development and testing.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-10 h-10 text-violet-500/30 mb-4" />

                            {/* Content */}
                            <p className="text-foreground/90 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                                    />
                                ))}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {testimonial.role} at {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
