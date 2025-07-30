
import React, { useState, useEffect } from 'react';
import UserEditModal from "../UserEditModal/UserEditModal"
import { IoMdClose } from "react-icons/io";
import './style.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [states, setStates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lead Table popup states
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadUserName, setLeadUserName] = useState("");
  const [leadCurrentPage, setLeadCurrentPage] = useState(1);
  const leadsPerPage = 10;
  const totalLeadPages = Math.ceil(leads.length / leadsPerPage);
  const leadStartIndex = (leadCurrentPage - 1) * leadsPerPage;
   const leadEndIndex = leadStartIndex + leadsPerPage;
const currentLeads = leads.slice(leadStartIndex, leadEndIndex);
  // API endpoints
  const API_BASE = 'https://roundrobin.luminlending.com/api';

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination values
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/`);
      const data = await response.json();
      console.log(data.users)
      if (data.success) {
        setUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    }
  };

  // Fetch states from API
  const fetchStates = async () => {
    try {
      const response = await fetch(`${API_BASE}/states/`);
      const data = await response.json();
      
      if (data.success) {
        setStates(data.states);
      } else {
        setError('Failed to fetch states');
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setError('Error fetching states');
    }
  };

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE}/locations/`);
      const data = await response.json();
      console.log(data)
      if (data.success) {
        setLocations(data.locations);
      } else {
        setError('Failed to fetch locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Error fetching locations');
    }
  };

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      const response = await fetch(`${API_BASE}/vendors/`);
      const data = await response.json();
      
      if (data.success) {
        setVendors(data.vendors);
      } else {
        setError('Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError('Error fetching vendors');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchStates(),
          fetchLocations(),
          fetchVendors()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const response = await fetch(`${API_BASE}/users/${updatedUser.ghl_user_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cap_value: updatedUser.cap_value,
          states: updatedUser.states,
          location_id: updatedUser.location.location_id || "",
          selected_vendors: updatedUser.selected_vendors || [],
           reset_lead_count: updatedUser.reset_lead_count || false
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the user in the local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.ghl_user_id === updatedUser.ghl_user_id ? updatedUser : user
          )
        );
        handleCloseModal();
        console.log('User updated successfully');
      } else {
        console.error('Failed to update user:', data.message);
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };
const handleViewLeads = async (user) => {
  try {
    const response = await fetch(`${API_BASE}/users/${user.ghl_user_id}/leads/`);
    
    const data = await response.json();


    if (data.success) {
      setLeads(data.leads);
      setLeadUserName(data.user_name);
      setIsLeadsModalOpen(true);
    } else {
      alert("Failed to fetch leads.");
    }
  } catch (err) {
    console.error("Error fetching leads:", err);
    alert("Something went wrong while fetching leads.");
  }
};

const handleYTDLeads = async(user) =>{ 
  try {
    const response = await fetch(`${API_BASE}/users/${user.ghl_user_id}/leads/year/`);
    
    const data = await response.json();
    console.log(data);
    if (data.success) {
      setLeads(data.leads);
      setLeadUserName(data.user_name);
      setIsLeadsModalOpen(true);
    } 
  } catch (err) {
    console.error("Error fetching leads:", err);
    alert("Something went wrong while fetching leads.");
  }
}

const handleDelete = async (user) => {
  try {
    const response = await fetch(`${API_BASE}/users/${user.ghl_user_id}/delete/`, {
      method: 'DELETE',
    });

    const data = await response.json();
    console.log('User deleted:', data);
    fetchUsers()
  } catch (err) {
    console.error('Error deleting user:', err);
  }
};

  if (loading) {
    return <div className="user-table-container">Loading...</div>;
  }

  if (error) {
    return <div className="user-table-container">Error: {error}</div>;
  }
  

   return (
    <div className="user-table-container">
      <h1>User Management</h1>
      
      <div className="table-info">
        <p>Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users</p>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Cap Value</th>
              <th>States</th>
              <th>Location</th>
              <th>Lead Vendors</th>
              <th>Daily Lead Count</th>
              <th>MTD Total Leads </th>
              <th>YTD Total Leads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.ghl_user_id}>
                <td>{startIndex + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.cap_value}</td>
                <td>
                  <div className="states-list">
                    {user.states.map((state, stateIndex) => (
                      <span key={stateIndex} className="state-tag">
                        {state}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{user?.location?.location_name ? user?.location?.location_name : ""}</td>
                <td>
                  <div className="states-list">
                    {(user.selected_vendors || []).map((vendor, vendorIndex) => (
                      <span key={vendorIndex} className="state-tag">
                        {vendor}
                      </span>
                    ))}
                  </div>
                </td>
                <td >{user.current_lead_count}</td>
                <td  style={{cursor: "pointer"}} onClick={() => handleViewLeads(user)}>{user.total_lead_count}</td>
                <td  style={{cursor: "pointer"}} onClick={() => handleYTDLeads(user)}>{user.year_total}</td>
                <td>
                  <div className="actions-btn-container">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                  <button 
                  className='delete-btn'
                  onClick={() => handleDelete(user)}
                  >
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
  <div className="pagination-wrapper" style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "center", alignItems: "center" }}>
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="pagination-button"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
      >
        {page}
      </button>
    ))}

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="pagination-button"
    >
      Next
    </button>
  </div>
)}

      {isModalOpen && editingUser && (
        <UserEditModal
          user={editingUser}
          states={states}
          locations={locations}
          vendors={vendors}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}

  {isLeadsModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Leads Assigned to {leadUserName}</h2>
     {leads.length === 0 ? (
  <p>No leads available.</p>
) : (
  <>
<div style={{"width" : "100%" , "overflow" : 'auto', "max-height" : "70vh"}}>
    <table className="leads-table">
      <thead className="lead-table-header">
        <tr>
          <th>Lead Name</th>
          <th>Lead Email</th>
          <th>Lead Phone</th>
          <th>State</th>
          <th>Vendor</th>
        </tr>
      </thead>
      <tbody>
        {currentLeads.map((lead, idx) => (
          <tr key={idx}>
            <td>{lead.lead_name}</td>
            <td>{lead.lead_email}</td>
            <td>{lead.lead_phone}</td>
            <td>{lead.lead_state}</td>
            <td>{lead.lead_vendor}</td>
          </tr>
        ))}
      </tbody>
    </table>
</div>
    {/* Pagination Controls for Leads */}
    {totalLeadPages > 1 && (
      <div className="pagination-wrapper" style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center" }}>
        <button
          onClick={() => setLeadCurrentPage(leadCurrentPage - 1)}
          disabled={leadCurrentPage === 1}
          className="pagination-button"
        >
          Prev
        </button>

        {Array.from({ length: totalLeadPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setLeadCurrentPage(page)}
            className={`pagination-button ${leadCurrentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => {
            setLeadCurrentPage(leadCurrentPage + 1)}}
          disabled={leadCurrentPage === totalLeadPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    )}
  </>
)}

      <button className="close-lead-popup" 
      
      onClick={() => {
        setIsLeadsModalOpen(false)
        setLeadCurrentPage(1)
        }}>
        <IoMdClose size={30} />
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default UserTable;


