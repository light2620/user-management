import React, { useState, useEffect, useCallback } from 'react';
import UserEditModal from "../UserEditModal/UserEditModal"
import { IoMdClose } from "react-icons/io";
import Spinner from '../../utils/Spinner';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
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
  const [searchType, setSearchType] = useState("lead_name");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Lead Table popup states
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadUserName, setLeadUserName] = useState("");
  const [leadCurrentPage, setLeadCurrentPage] = useState(1);
  const leadsPerPage = 20;
  const [userSearchType, setUserSearchType] = useState("location");
const [userSearchQuery, setUserSearchQuery] = useState("");

  // Sorting State for Users
  const [userSortColumn, setUserSortColumn] = useState(null);
  const [userSortOrder, setUserSortOrder] = useState('asc');
  const [isUserSortingActive, setIsUserSortingActive] = useState(false);

  // Sorting State for Leads
  const [leadSortColumn, setLeadSortColumn] = useState(null);
  const [leadSortOrder, setLeadSortOrder] = useState('asc');
  const [isLeadSortingActive, setIsLeadSortingActive] = useState(false);


  // API endpoints
  const API_BASE = 'https://roundrobin.luminlending.com/api';




  const filteredUsers = users.filter(user => {
  if (userSearchType === "location") {
    return (user.location?.location_name || "")
      .toLowerCase()
      .includes(userSearchQuery.toLowerCase());
  }
  if (userSearchType === "loan_officer") {
    return (
      user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }
  return true;
});
  // Sort users based on current sorting criteria
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!userSortColumn) return 0;

    let valueA, valueB;

    if (userSortColumn === 'states') {
      //Sort by the number of states
      valueA = a.states.length;
      valueB = b.states.length;
    } else if (userSortColumn === 'location') {
        // Sort by location name
        valueA = a.location?.location_name || ""; // Handle null/undefined locations
        valueB = b.location?.location_name || "";

    } else if (userSortColumn === 'selected_vendors') {
      // Sort by the number of vendors
      valueA = (a.selected_vendors || []).length;  // Handle null/undefined vendors
      valueB = (b.selected_vendors || []).length;
    }
    else if (userSortColumn === 'daily_quota' || userSortColumn === 'total_lead_count' || userSortColumn === 'year_total') {
      valueA = Number(a[userSortColumn]);
      valueB = Number(b[userSortColumn]);
    }
    else{
       valueA = a[userSortColumn];
       valueB = b[userSortColumn];
    }


    if (valueA < valueB) {
      return userSortOrder === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return userSortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

    // Calculate pagination values for users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
const currentUsers = sortedUsers.slice(startIndex, endIndex);


    // Calculate pagination values for leads
    const totalLeadPages = Math.ceil(leads.length / leadsPerPage);
    const leadStartIndex = (leadCurrentPage - 1) * leadsPerPage;
    const leadEndIndex = leadStartIndex + leadsPerPage;
    const filteredLeads = leads.filter((lead) => {
   const valueToSearch = lead[searchType]?.toLowerCase() || "";
   return valueToSearch.includes(searchQuery.toLowerCase());
 });

 const totalFilteredLeadPages = Math.ceil(filteredLeads.length / leadsPerPage);
 const filteredStartIndex = (leadCurrentPage - 1) * leadsPerPage;
 const filteredEndIndex = filteredStartIndex + leadsPerPage;

   // Sort leads based on current sorting criteria
   const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!leadSortColumn) return 0;

    let valueA = a[leadSortColumn];
    let valueB = b[leadSortColumn];

        // Convert date strings to Date objects for date comparison
        if (leadSortColumn === 'date_received') {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
      }

    if (valueA < valueB) {
      return leadSortOrder === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return leadSortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
 const currentLeads = sortedLeads.slice(filteredStartIndex, filteredEndIndex);


  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  //User Sorting handler
  const handleUserSort = (column) => {
    setIsUserSortingActive(true);

    if (userSortColumn === column) {
      // If already sorting by this column, toggle the sort order
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new column, set the sort column and default to ascending order
      setUserSortColumn(column);
      setUserSortOrder('asc');
    }
  };

  //Lead Sorting handler
  const handleLeadSort = (column) => {
    setIsLeadSortingActive(true);

    if (leadSortColumn === column) {
      // If already sorting by this column, toggle the sort order
      setLeadSortOrder(leadSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new column, set the sort column and default to ascending order
      setLeadSortColumn(column);
      setLeadSortOrder('asc');
    }
  };


  // Reset user sorting
  const resetUserSorting = () => {
    setUserSortColumn(null);
    setUserSortOrder('asc');
    setIsUserSortingActive(false);
  };

    // Reset lead sorting
    const resetLeadSorting = () => {
      setLeadSortColumn(null);
      setLeadSortOrder('asc');
      setIsLeadSortingActive(false);
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
          reset_lead_count: updatedUser.reset_lead_count || false,
          daily_quota: updatedUser.daily_quota,
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

  const handleYTDLeads = async (user) => {
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

  const handleDailyLeads = async (user) => {

    try {
      const response = await fetch(`${API_BASE}/users/${user.ghl_user_id}/leads/day/`);

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setLeads(data.leads);
        setLeadUserName(data.user_name);
        setIsLeadsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
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
    return <div className="user-table-loading"><Spinner /></div>;
  }

  if (error) {
    return <div className="user-table-container">Error: {error}</div>;
  }


  return (
    <div className="user-table-container">
      <h1>User Management</h1>

      <div className="table-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: "flex", alignItems: "center" , justifyContent: "center",gap: "16px"}}>
<p>Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users</p>

<div className="user-search-controls" style={{ display: "flex"  }}>
     <div>
      <select value={userSearchType} onChange={(e) => setUserSearchType(e.target.value)} style={{ marginLeft: "8px" }}>
        <option value="location">Location</option>
        <option value="loan_officer">Loan Officer</option>
      </select>

    <input
      type="text"
      placeholder={`Search by ${userSearchType === "location" ? "Location" : "Loan Officer"}`}
      value={userSearchQuery}
      className="lead-search-input"
      onChange={(e) => {
        setUserSearchQuery(e.target.value);
        setCurrentPage(1); // reset pagination
      }}
    />
    </div>
  </div>
        </div>
        

        <div className="items-per-page-selector">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
       {isUserSortingActive && (
          <button onClick={resetUserSorting} className="reset-sorting-btn">
            Reset Sorting
          </button>
        )}
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th onClick={() => handleUserSort('name')}>
                Name
                {userSortColumn === 'name' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('email')}>
                Email
                {userSortColumn === 'email' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('daily_quota')}>
                Daily Quota
                {userSortColumn === 'daily_quota' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('cap_value')}>
                Cap Value
                {userSortColumn === 'cap_value' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('states')}>
                States
                {userSortColumn === 'states' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
               <th onClick={() => handleUserSort('location')}>
                  Location
                  {userSortColumn === 'location' ? (
                      userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                  ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('selected_vendors')}>
                Lead Vendors
                {userSortColumn === 'selected_vendors' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('current_lead_count')}>
                Daily Leads Assigned
                {userSortColumn === 'current_lead_count' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('total_lead_count')}>
                MTD Total Leads
                {userSortColumn === 'total_lead_count' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th onClick={() => handleUserSort('year_total')}>
                YTD Total Leads
                {userSortColumn === 'year_total' ? (
                  userSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                ) : <FaSort />}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.ghl_user_id}>
                <td>{startIndex + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.daily_quota}</td>
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
                <td style={{ cursor: "pointer" }} onClick={() => handleDailyLeads(user)}>{user.current_lead_count}</td>
                <td style={{ cursor: "pointer" }} onClick={() => handleViewLeads(user)}>{user.total_lead_count}</td>
                <td style={{ cursor: "pointer" }} onClick={() => handleYTDLeads(user)}>{user.year_total}</td>
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
              <div className="leads-data-wrapper">
                <div className="lead-search-controls" style={{ display: "flex", marginBottom: "16px", alignItems: "center" }}>
                  <label htmlFor='searchType' >
                    Search By:
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ marginLeft: "8px" }}>
                      <option value="lead_name">Lead Name</option>
                      <option value="lead_email">Lead Email</option>
                      <option value="assigned_user">Assigned User</option>
                    </select>
                  </label>

                  <input
                    type="text"
                    placeholder={`Search by ${searchType.replace("_", " ")}`}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setLeadCurrentPage(1); // reset to first page when filtering
                    }}
                    className="lead-search-input"
                  />
                </div>
                {isLeadSortingActive && (
                    <button onClick={resetLeadSorting} className="reset-sorting-btn">
                      Reset Sorting
                    </button>
                  )}
                <div className="leads-table-container">
                  <table className="leads-table">
                    <thead className="lead-table-header">
                      <tr>
                        <th onClick={() => handleLeadSort('lead_name')}>
                          Lead Name
                          {leadSortColumn === 'lead_name' ? (
                            leadSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                          ) : <FaSort />}
                        </th>
                        <th onClick={() => handleLeadSort('lead_email')}>
                          Lead Email
                          {leadSortColumn === 'lead_email' ? (
                            leadSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                          ) : <FaSort />}
                        </th>
                        <th onClick={() => handleLeadSort('lead_phone')}>
                            Lead Phone
                            {leadSortColumn === 'lead_phone' ? (
                                leadSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                            ) : <FaSort />}
                        </th>
                        <th onClick={() => handleLeadSort('lead_state')}>
                            State
                            {leadSortColumn === 'lead_state' ? (
                                leadSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                            ) : <FaSort />}
                        </th>
                        <th onClick={() => handleLeadSort('lead_vendor')}>
                            Vendor
                            {leadSortColumn === 'lead_vendor' ? (
                                leadSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                            ) : <FaSort />}
                        </th>
                        <th onClick={() => handleLeadSort('date_received')}>
                            Date Received
                            {leadSortColumn === 'date_received' ? (
                                leadSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                            ) : <FaSort />}
                        </th>
                        <th onClick={() => handleLeadSort('assigned_user')}>
                            Assigned User
                            {leadSortColumn === 'assigned_user' ? (
                                leadSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                            ) : <FaSort />}
                        </th>
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
                          <td>{lead.date_received}</td>
                          <td>{lead.assigned_user}</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalFilteredLeadPages > 1 && (
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
                      onClick={() => setLeadCurrentPage(leadCurrentPage + 1)}
                      disabled={leadCurrentPage === totalLeadPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="close-lead-popup"
              onClick={() => {
                setIsLeadsModalOpen(false);
                setLeadCurrentPage(1);
              }}
            >
              <IoMdClose size={30} />
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default UserTable;