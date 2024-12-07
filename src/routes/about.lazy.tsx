import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: App,
});

function App() {
  return (
    <main className="container">
      <p>test from about.tsx</p>
      <a href="/">Index</a>
    </main>
  );
}
