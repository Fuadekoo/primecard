"use client";
import React from "react";
import { Button } from "@heroui/react";
import Image from "next/image";
import Insta from "../public/insta.png";
import Tiktok from "../public/tiktok2.png";
import whatsapp from "../public/wa.png";
import telegram from "../public/tg.png";
import Youtube from "../public/yt.png";
import Website from "../public/web.png";
import scan from "../public/scan2.png";
import Qrcode from "../public/qrcode.png";
import Link from "next/link";

function BusinessCard() {
  return (
    <div className="grid grid-cols-1 h-dvh w-dvw ">
      {/* Cover section */}
      <div className="relative w-full h-40 md:h-56 rounded-sm">
        <Image
          src="/cover.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
        {/* Avatar: half in cover, half below */}
        <div className="absolute left-1/2 bottom-0 z-20 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-28 h-28 md:w-32 md:h-36 rounded-sm border-4  overflow-hidden shadow-lg bg-white">
            <Image
              src="/logo.png"
              alt="Profile Avatar"
              width={128}
              height={128}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
      {/* Remove spacer and add padding top to next section */}
      <div className="justify-center items-center flex flex-col pt-16 md:pt-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-900 mb-2">
          Prime Rentals
        </h1>
        <p className="text-base md:text-lg text-primary-800 mb-4 text-center">
          Your prime choice for rental property!
        </p>
        <div className="grid grid-cols-1 gap-3">
          <Link
            href="https://www.instagram.com/prime_rental1/profilecard/?igsh=bXEzZTNuZnY1dmdy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:scale-110 transition-transform"
          >
            <Image src={Insta} alt="Instagram" width={40} height={40} />
            <span className="text-primary-700 font-semibold text-base">
              Instagram
            </span>
          </Link>
          <Link
            href="https://www.tiktok.com/@prime_rental?_t=ZM-8ygWMSDW7jp&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:scale-110 transition-transform"
          >
            <Image src={Tiktok} alt="TikTok" width={40} height={40} />
            <span className="text-primary-700 font-semibold text-base">
              TikTok
            </span>
          </Link>
          <Link
            href="https://youtube.com/@primeplc?si=cev2DQIr7IlXU6v0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:scale-110 transition-transform"
          >
            <Image src={Youtube} alt="YouTube" width={40} height={40} />
            <span className="text-primary-700 font-semibold text-base">
              YouTube
            </span>
          </Link>
          <Link
            href="https://primeaddis.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:scale-110 transition-transform"
          >
            <Image src={Website} alt="Website" width={40} height={40} />
            <span className="text-primary-700 font-semibold text-base">
              Website
            </span>
          </Link>
          <Link
            href="https://wa.me/qr/XFZIVZ2X5SKWF1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:scale-110 transition-transform"
          >
            <Image src={whatsapp} alt="WhatsApp" width={40} height={40} />
            <span className="text-primary-700 font-semibold text-base">
              WhatsApp
            </span>
          </Link>
          <Link
            href="https://t.me/Rental_house"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:scale-110 transition-transform"
          >
            <Image src={telegram} alt="Telegram" width={40} height={40} />
            <span className="text-primary-700 font-semibold text-base">
              Telegram
            </span>
          </Link>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <Button
          variant="solid"
          color="primary"
          as="a"
          href="tel:+251933571691"
          className="font-semibold px-6 py-2 rounded-3xl shadow hover:bg-primary-100 transition text-primary-900 "
        >
          Call +2519-33571691
        </Button>
      </div>
    </div>
  );
}

export default BusinessCard;
