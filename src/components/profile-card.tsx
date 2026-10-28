import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import Image from "next/image";
import { BsTwitterX, BsWhatsapp } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialLinkedin,
} from "react-icons/ti";

interface ProfileCardProps {
  isOpen: boolean;
  name: string;
  title: string;
  profileUrl: string;
  bio: string;
  onFacebookPress?: () => void;
  onWhatsAppPress?: () => void;
  onInstagramPress?: () => void;
  onLinkedInPress?: () => void;
  onXPress?: () => void;
  onClose?: () => void;
}

export default function ProfileCard({
  isOpen,
  name,
  title,
  profileUrl,
  bio,
  onFacebookPress,
  onInstagramPress,
  onWhatsAppPress,
  onLinkedInPress,
  onXPress,
  onClose,
}: ProfileCardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop: Clicking this closes the popover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Popover Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
            className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-10 p-4 md:p-6 flex flex-col items-center justify-start md:justify-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 md:right-4 md:top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition-colors border-none cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            {/* Main Content Wrapper - Column on Mobile, Row on Desktop */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full mt-8 md:mt-0">
              <div className="relative h-64 sm:h-80 md:h-100 w-full md:w-1/2 shrink-0 md:rounded-2xl">
                <Image
                  src={profileUrl}
                  alt={name}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* Popover Content */}
              <div className="flex flex-col justify-center py-2 md:py-6 relative text-white w-full md:w-1/2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-thin">{name}</h2>
                <p className="text-emerald-400 font-medium mt-1 mb-3 md:mb-4">{title}</p>
                {bio && bio.trim() !== "Station Staff Member." && (
                  <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">{bio}</p>
                )}
              </div>
            </div>

            {/* Bottom Action Bar - Stacked on Mobile, Spread on Desktop */}
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
              {/* Social Icons */}
              <div className="flex flex-row items-center justify-center gap-2 md:gap-3 flex-wrap w-full sm:w-auto">
                <button onClick={onFacebookPress} className="rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <TiSocialFacebook size={26} className="md:w-7.5 md:h-7.5" />
                </button>
                <button onClick={onInstagramPress} className="rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <TiSocialInstagram size={26} className="md:w-7.5 md:h-7.5" />
                </button>
                <button onClick={onLinkedInPress} className="rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <TiSocialLinkedin size={26} className="md:w-7.5 md:h-7.5" />
                </button>
                <button onClick={onXPress} className="rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <BsTwitterX size={24} className="md:w-6.5 md:h-6.5 m-px" />
                </button>
                <button onClick={onWhatsAppPress} className="rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <BsWhatsapp size={24} className="md:w-6.5 md:h-6.5 m-px" />
                </button>
              </div>

              {/* Call Button - Full width on small screens */}
              <button className="text-black bg-emerald-500 w-full sm:w-auto flex flex-row gap-3 items-center justify-center py-3 px-6 md:px-8 rounded-xl cursor-pointer hover:bg-emerald-600 transition-colors duration-300">
                <Phone size={20} />
                <span className="text-lg md:text-xl font-semibold capitalize">call me</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}