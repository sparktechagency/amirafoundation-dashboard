
import Image from "next/image";
import React from "react";
import logo from "@/assets/images/logowhite.png";

export default function AuthLayout({ children }) {
  return (
    <main className="flex h-screen items-center justify-center relative "
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    
    >
      <div className="lg:w-[65%] mx-auto">
        <div className=" flex gap-10 justify-center items-center">
        <div className="bg-[#D9A48E] h-screen flex justify-center items-center w-full" >
          <Image className="w-[300px]" src={logo} alt="background" width={1800} height={1800}/>
        </div>
        <div className="bg-white w-full">{children}</div>
        </div>
      </div>

    </main>
  );
}
