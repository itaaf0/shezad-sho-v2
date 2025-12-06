
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export function SiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#19454B] text-white text-xs">
            <div className="container py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo and Social */}
                    <div className="space-y-4 col-span-2 sm:col-span-1">
                        <Image src="https://raw.githubusercontent.com/itaaf0/Itaaf-product-images/main/shezad%20trnprnt.png" alt="Company Logo" width={100} height={40} style={{filter: 'brightness(0) invert(1)'}} />
                        <p className="text-gray-300">
                            Where elegance is woven in
                        </p>
                        <div className="flex space-x-3">
                            <a href="https://www.facebook.com/share/14P2Dcb26a5/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://linkedin.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold uppercase mb-3">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-300 hover:text-white hover:underline">আমাদের সম্পর্কে</Link></li>
                            <li><Link href="/shipping" className="text-gray-300 hover:text-white hover:underline">শিপিং</Link></li>
                            <li><Link href="/returns" className="text-gray-300 hover:text-white hover:underline">রিটার্ন</Link></li>
                            <li><Link href="/faq" className="text-gray-300 hover:text-white hover:underline">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Service */}
                    <div>
                        <h3 className="font-bold uppercase mb-3">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="text-gray-300 hover:text-white hover:underline">যোগাযোগ</Link></li>
                            <li><Link href="/terms" className="text-gray-300 hover:text-white hover:underline">ব্যবহারের শর্তাবলী</Link></li>
                            <li><Link href="/privacy" className="text-gray-300 hover:text-white hover:underline">গোপনীয়তা নীতি</Link></li>
                            <li><Link href="/track-order" className="text-gray-300 hover:text-white hover:underline">অর্ডার ট্র্যাক</Link></li>
                        </ul>
                    </div>
                    
                    {/* Column 4: Contact Us */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <h3 className="font-bold uppercase mb-3">Contact Us</h3>
                        <div className="text-gray-300">
                            <p>House-01,Road-01,New Town R/A,Matuail,Demra,Dhaka</p>
                            <p>ফোন: <a href="tel:+8801762040840" className="hover:text-white hover:underline">+880 1762040840</a></p>
                            <p>ইমেইল: <a href="mailto:itaafshop@gmail.com" className="hover:text-white hover:underline">itaafshop@gmail.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-[#006884]">
                <div className="container mx-auto py-3 px-4 flex flex-col sm:flex-row justify-between items-center text-gray-300 gap-4">
                    <p>&copy; {currentYear} Itaaf.com All Rights Reserved.</p>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <Image src="https://raw.githubusercontent.com/itaaf0/Itaaf-product-images/main/cash-on-delivery.png" alt="cash-on-delivery" width={32} height={20} className="bg-white p-0.5 rounded-sm" />       
                        <Image src="https://raw.githubusercontent.com/itaaf0/Itaaf-product-images/main/visa.png" alt="Visa" width={32} height={20} className="bg-white p-0.5 rounded-sm"/>
                        <Image src="https://raw.githubusercontent.com/itaaf0/Itaaf-product-images/main/card.png" alt="Mastercard" width={32} height={20} className="bg-white p-0.5 rounded-sm"/>
                        <Image src="https://raw.githubusercontent.com/itaaf0/Itaaf-product-images/main/Nagad-Logo.wine.png" alt="Nagad" width={32} height={20} className="bg-white p-0.5 rounded-sm"/>
                        <Image src="https://raw.githubusercontent.com/itaaf0/Itaaf-product-images/main/bkash-seeklogo.png" alt="Bkash" width={32} height={20} className="bg-white p-0.5 rounded-sm"/>
                    </div>
                </div>
            </div>
        </footer>
    );
}
