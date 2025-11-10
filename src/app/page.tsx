import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/home/Footer';

export default function Home() {
	return (
		<div className="min-h-screen">
			<Header />
			<main>
				<Hero />
				<Features />
				<Testimonials />
			</main>
			<Footer />
		</div>
	);
}
