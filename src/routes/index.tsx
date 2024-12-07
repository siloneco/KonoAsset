// import { useState } from "react";
// import reactLogo from "../assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => App(),
});

function App() {
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <main className="container">
      <p>test from index.tsx</p>
      <a href="/about">About</a>
      <Button>Click me</Button>
    </main>
  );
}
