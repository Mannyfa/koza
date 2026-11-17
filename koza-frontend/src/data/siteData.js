import heroImage1 from '../images/hero-1.webp';
import heroImage2 from '../images/hero-2.webp';
import heroImage3 from '../images/hero-3.webp';
import heroImage4 from '../images/hero-4.webp';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../config/constants';

export const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Shop', page: 'shop' },
    { name: 'Learn', page: 'learn' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' },
];

export const heroSlides = [
    { imageUrl: heroImage1, title: 'Unmatched Quality.', subtitle: 'Discover flawless fragrances that empower your style.' },
    { imageUrl: heroImage2, title: 'Define Your Essence.', subtitle: 'Premium collection of curated, long-lasting scents.' },
    { imageUrl: heroImage3, title: 'Timeless Aura.', subtitle: 'Achieve a sophisticated presence with every spray.' },
    { imageUrl: heroImage4, title: 'Pure Confidence.', subtitle: 'Invest in perfume that makes you feel incredible.' },
];

// `icon` must match a key exported from components/icons
export const whyUsData = [
    { title: '100% Quality Perfumes', description: 'We source only the highest quality, undiluted perfumes for all our products.', icon: 'SparklesIcon' },
    { title: 'No Stains Experts', description: 'Our high-definition sprays provides the most natural-looking, undetectable perfume stains.', icon: 'ScissorsIcon' },
    { title: 'Fast, Secure Delivery', description: 'Your order is processed quickly and shipped securely to your doorstep.', icon: 'TruckIcon' },
    { title: 'Exceptional Support', description: 'Our dedicated team is here to help you with any questions or concerns.', icon: 'ChatBubbleIcon' },
];

export const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', icon: 'InstagramIcon' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@opevickyscents?_r=1&_t=ZS-98d6IGw5WAj', icon: 'TiktokIcon' },
    { label: 'Twitter', href: 'https://twitter.com', icon: 'TwitterIcon' },
    { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: 'WhatsAppIcon' },
    { label: 'Email', href: `mailto:${CONTACT_EMAIL}`, icon: 'MailIcon', internal: true },
];
