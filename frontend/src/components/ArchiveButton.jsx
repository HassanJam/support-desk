import { IoMdArchive } from "react-icons/io";

export const ArchiveButton = ({ onClick, showArchived }) => {
  return (
    <button onClick={onClick} className="btn btn-reverse btn-archive">
      <IoMdArchive />
      {showArchived ? "Hide Archived" : "Show Archived"}
    </button>
  );
};

export default ArchiveButton;
