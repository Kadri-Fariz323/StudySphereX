export const StatusBadge = ({ status, isPublished }) => {
if (status === 'pending') {
    return (
      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
         Pending
      </span>
    );
  }

  // 2. Rejected Logic
  if (status === 'rejected') {
    return (
      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
         Rejected
      </span>
    );
  }

  // 3. Approved Logic (Check isPublished to be sure)
  if (status === 'approved') {
    return (
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
        {isPublished ? " Live" : "⏸️ Approved (Hidden)"}
      </span>
    );
  }

  return <span>Draft</span>;
};