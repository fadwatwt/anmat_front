import EmailInvitation from "../components/EmailInvitation";
import NotificationsPage from "./Notifications/Notifications";
import Page from "./Page";

function DashboardPage() {
  return (
    <div>
      {/* <EmailInvitation /> */}
      <Page title={"Notifications"} isNavs={true}>
        <NotificationsPage />
      </Page>
    </div>
  );
}

export default DashboardPage;
