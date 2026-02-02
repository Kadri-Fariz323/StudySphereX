import React, { useEffect, useState } from "react";
import { Search, Mail, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { fetchContactsService, updateContactStatusService } from "@/services/AdminServices";
import { Button } from "@/components/UI/button";

export const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ... (Keep existing useEffect and loadContacts logic same as before) ...
  useEffect(() => {
      const timeoutId = setTimeout(() => {
        loadContacts();
      }, 500);
      return () => clearTimeout(timeoutId);
    }, [search, page]);
  
    const loadContacts = async () => {
      try {
        setLoading(true);
        const response = await fetchContactsService(page, 10, search);
        if (response.success) {
          setContacts(response.data);
          setTotalPages(response.pagination.totalPages);
        }
      } catch (error) {
        console.error("Failed to load contacts", error);
      } finally {
        setLoading(false);
      }
    };

  // --- NEW REPLY LOGIC ---
  const handleReply = async (contactId, email, name) => {
    // 1. Construct Gmail URL (Specific for opening in Gmail Web)
    const subject = encodeURIComponent("Re: Your inquiry regarding SkillSync");
    const body = encodeURIComponent(`Hi ${name},\n\nThank you for reaching out to us.\n\n`);
    
    // This URL forces Gmail to open in compose mode
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

    // 2. Open Gmail in new tab
    window.open(gmailUrl, '_blank');

    // 3. Update Status in Backend to 'responded'
    try {
      // Optimistic Update (Update UI immediately before API responds)
      setContacts(prev => prev.map(c => 
        c._id === contactId ? { ...c, status: 'responded' } : c
      ));

      await updateContactStatusService(contactId, 'responded');
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert if failed (optional, usually not needed for minor status updates)
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      new: "bg-blue-100 text-blue-800 border-blue-200",
      read: "bg-yellow-100 text-yellow-800 border-yellow-200",
      responded: "bg-green-100 text-green-800 border-green-200"
    };

    const icons = {
      new: <Clock className="w-3 h-3" />,
      read: <ExternalLink className="w-3 h-3" />,
      responded: <CheckCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.new}`}>
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* ... (Header and Search remain the same) ... */}
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Support Messages</h2>
        {/* ... Search Input ... */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
               <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
            ) : contacts.map((contact) => (
              <tr key={contact._id} className={`transition-colors ${contact.status === 'new' ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                <td className="px-4 py-4 w-1/4 align-top">
                  <div className="font-medium text-gray-900">{contact.name}</div>
                  <div className="text-xs text-gray-500">{contact.email}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </td>
                
                <td className="px-4 py-4 w-1/2 align-top">
                  <div className="text-gray-700 whitespace-pre-wrap text-sm">{contact.message}</div>
                </td>

                <td className="px-4 py-4 align-top">
                  <StatusBadge status={contact.status} />
                </td>

                <td className="px-4 py-4 text-right align-top">
                  {contact.status !== 'responded' ? (
                    <Button
                      onClick={() => handleReply(contact._id, contact.email, contact.name)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all"
                    >
                      <Mail className="w-3 h-3" />
                      Reply via Gmail
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium flex items-center justify-end gap-1">
                      <CheckCircle className="w-3 h-3"/> Replied
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* ... (Pagination remains the same) ... */}
    </div>
  );
};