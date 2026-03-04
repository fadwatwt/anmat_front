import PropTypes from "prop-types";
import Link from 'next/link'

function NameAndDescription({ name, description, path }) {
  console.log(description, "description")
  return (
    <Link href={path}>
      <p title={name} className="text-sm text-cell-primary truncate max-w-[200px]">{name}</p>
      <p title={description} className="text-xs text-cell-secondary truncate max-w-[200px]">
        {description}
      </p>
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
