import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

function AccountDetails({ account, path }) {
  const router = useRouter();
  const handelOnClick = () => {
    router.push(path);
  };
  return (
    <>
      <div
        className={`flex items-center gap-2 ${path && "cursor-pointer"}`}
        onClick={path && handelOnClick}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={account.imageProfile}
          alt={""}
        />
        <div>
          <p className={"text-sm text-sub-500 truncate w-full dark:text-sub-300"}>
            {account.name}
          </p>
          {/* <p className="text-xs text-sub-500 dark:text-sub-300">
            {account.rule}
          </p> */}
        </div>
      </div>
    </>
  );
}

AccountDetails.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string,
    rule: PropTypes.string,
    imageProfile: PropTypes.string,
  }),
  path: PropTypes.string,
};

export default AccountDetails;
