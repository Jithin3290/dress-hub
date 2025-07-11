import React from 'react';

function Footer() {
  return (
    <div className="bg-gray-900 text-white px-6 py-10" style={{ background: "linear-gradient(to right, #fde1ff, #e1ffea22)" }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-10">

        <div className="flex flex-col items-center md:items-start gap-2">
          <img src="./product/logo_big.png" alt="logo" className="w-16 h-16 " />
          <p className="text-black text-xl font-semibold">DressHub</p>
        </div>

        <ul className="flex flex-col md:flex-row gap-4 text-sm text-gray-300">
          <li className="text-black  cursor-pointer">Company</li>
          <li className="text-black  cursor-pointer">Products</li>
          <li className="text-black  cursor-pointer">Offices</li>
          <li className="text-black  cursor-pointer">About</li>
          <li className="text-black  cursor-pointer">Contact</li>
        </ul>

        <div className="flex gap-4">
          <div className="bg-white-800 p-2 rounded-full hover:bg-gray-700 transition">
            <img src="./product/instagram_icon.png" alt="Instagram" className="w-5 h-5" />
          </div>
          <div className="bg-white-800 p-2 rounded-full hover:bg-gray-700 transition">
            <img src="./product/pintester_icon.png" alt="Pinterest" className="w-5 h-5" />
          </div>
          <div className="bg-white-800 p-2 rounded-full hover:bg-gray-700 transition">
            <img src="./product/whatsapp_icon.png" alt="WhatsApp" className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} DressHub. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
