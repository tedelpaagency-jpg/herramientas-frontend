"use client";
import { initCounterUp } from "@/utils/counterUp";
import ScrollCircleProgress from "@/utils/ScrollCircleProgess";
import React, { useEffect } from "react";

const ClientRoot = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    import("bootstrap");
  }, []);
  useEffect(() => {
    initCounterUp(); // auto-activate all .counter elements
  }, []);

  useEffect(() => {
    // The public frontend must ALWAYS have a clean, light theme and never inherit CRM dark mode
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");

    const prevBg = document.body.style.backgroundColor;
    const prevColor = document.body.style.color;

    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#1f2937";

    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);

  return (
    <>
      {children}
      <ScrollCircleProgress />
    </>
  );
};

export default ClientRoot;
