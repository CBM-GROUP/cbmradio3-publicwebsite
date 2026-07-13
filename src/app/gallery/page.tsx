import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

const galleryItems = [
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900",
];

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-950 px-6 py-24 text-white sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Gallery
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">CBM Radio Moments</h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-400">
            A glimpse into the energy, events and creativity behind the CBM Radio experience.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {galleryItems.map((item, index) => (
              <Image
                key={item}
                src={item}
                alt={`Gallery item ${index + 1}`}
                width={900}
                height={600}
                unoptimized
                className="h-72 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
