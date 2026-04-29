import Image from "next/image";

// ? Components
import { Footer } from "@/components/navigation/footer";

export default function Home() {
  return (
    <>
      <div className="px-6">
        <div className="h-[calc(100lvh-93px)] flex flex-col justify-end py-6">
          <p className="text-3xl">Modern</p>
          <h1 className="text-8xl">Cources platform</h1>
        </div>
      </div>
      <Footer />
    </>
  );
}
