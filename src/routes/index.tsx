import { createFileRoute } from "@tanstack/react-router";
import { Deck } from "@/deck/Deck";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Deck />;
}
