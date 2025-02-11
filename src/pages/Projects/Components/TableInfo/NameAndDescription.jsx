import PropTypes from "prop-types";
import { Link } from "react-router";

function NameAndDescription({ name, description, path }) {
  return (
    <Link to={path}>
      <p className="text-sm text-main-100 dark:text-main-900">{name}</p>
      {/* <p className="text-xs text-sub-500 truncate dark:text-sub-300">
        {description}
      </p> */}
    </Link>
  );
}

NameAndDescription.propTypes = {
  name: PropTypes.string,
  path: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
};

export default NameAndDescription;
