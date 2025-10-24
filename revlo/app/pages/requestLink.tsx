import Nav from "../ui/nav";
import PageCard from "../ui/pageCard";
import Icon from "../ui/icon";

export default function RequestLink() {
  return (
    <>
      <div className="w-full space-y-8">
        <Nav />
        <div className="mx-28 space-y-8">
          <PageCard icon={<Icon />} title="Document Request">
            <p>Upload and manage client documents securely.</p>
          </PageCard>
          <PageCard icon={<Icon />} title="Document Request">
            <p>Upload and manage client documents securely.</p>
          </PageCard>
        </div>
      </div>
    </>
  );
}
