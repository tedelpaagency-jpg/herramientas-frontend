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
  return (
    <>
      {children}
      <ScrollCircleProgress />
    </>
  );
};

export default ClientRoot;
