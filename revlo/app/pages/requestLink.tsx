import Nav from "../ui/nav";
import PageCard from "../ui/pageCard";
import Icon from "../ui/icons/icon";
import RequestDetailsList from "../ui/requestDetailsList";

export default function RequestLink() {
  return (
    <>
      <div className="w-full space-y-8">
        <Nav />
        <div className="mx-28 space-y-8">
          <PageCard icon={<Icon />} title="Document Request">
            <div className="flex justify-between">
              <RequestDetailsList
                title="Request Details"
                items={[
                  "Requested by: Luke Padula",
                  "Purpose: Verify identity for rental agreement",
                  "Expires: 48 hours",
                ]}
              />
              <RequestDetailsList
                title="Data Policy"
                listItemIcon={}
                items={[
                  "End-to-end encryption enabled",
                  "Automatic deletion after 7 days or upon review completion",
                  "Audit trail maintained",
                ]}
              />
            </div>
          </PageCard>
          <PageCard icon={<Icon />} title="Document Request">
            <p>Upload and manage client documents securely.</p>
          </PageCard>
        </div>
      </div>
    </>
  );
}
