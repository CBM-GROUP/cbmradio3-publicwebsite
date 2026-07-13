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
  onWhatsAppPress?:()=> void;
  onInstagramPress?: () => void;
  onLinkedInPress?: () => void;
  onXPress?: ()=> void;
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop: Clicking this closes the popover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Popover Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl z-10 p-4 flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition-colors border-none cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            <div className="flex flex-row gap-4">
              {/* Popover Image Header */}
              <div className="relative h-110 w-full">
                <Image
                  src={profileUrl}
                  alt={name}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              {/* Popover Content */}
              <div className="p-6 relative text-white w-full h-full">
                <h2 className="text-5xl font-thin">{name}</h2>
                <p className="text-emerald-400 font-medium mb-4">{title}</p>
                <p className="text-zinc-300 leading-relaxed">{bio}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-row justify-between gap-3 w-full">
              <div className="flex flex-row items-center gap-2">
                <button onClick={onFacebookPress} className="flex-1 rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <TiSocialFacebook size={30} />
                </button>
                <button onClick={onInstagramPress} className="flex-1 rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <TiSocialInstagram size={30} />
                </button>
                <button onClick={onLinkedInPress} className="flex-1 rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <TiSocialLinkedin size={30} />
                </button>
                <button onClick={onXPress} className="flex-1 rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <BsTwitterX size={30} />
                </button>
                <button onClick={onWhatsAppPress} className="flex-1 rounded-full bg-emerald-500 p-2 font-semibold text-black transition hover:bg-emerald-400 cursor-pointer border-none">
                  <BsWhatsapp size={30} />
                </button>
              </div>

              <button className="text-black bg-emerald-500 flex flex-row gap-3 items-center justify-center py-2 px-6 rounded-xl cursor-pointer hover:bg-emerald-600 transition-colors duration-300">
                <Phone />
                <h5 className="text-xl font-semibold capitalize">call me</h5>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
