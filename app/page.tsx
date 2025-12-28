import CallToAction from "./landing/CallToAction";
import Features from "./landing/Features";
import Footer from "./landing/Footer";
import Hero from "./landing/Hero";
import Nav from "./landing/Nav";
import Separator from "./landing/Separator";
import Solution from "./landing/Solution";
import UseCases from "./landing/UseCases";

const sectionOrder = [
  { id: "hero", label: "Hero introduction", component: <Hero /> },
  { id: "security", label: "Security overview", component: <Separator /> },
  { id: "product", label: "Product features", component: <Features /> },
  { id: "use-cases", label: "Use cases", component: <UseCases /> },
  { id: "lifecycle", label: "Solution lifecycle", component: <Solution /> },
  { id: "pricing", label: "Call to action", component: <CallToAction /> },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        role="main"
        aria-label="Revlo secure document workflow overview"
      >
        {sectionOrder.map(({ id, label, component }) => (
          <div key={id} id={id} role="region" aria-label={label}>
            {component}
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
