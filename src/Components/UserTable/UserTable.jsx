
import React, { useState, useEffect } from 'react';
import UserEditModal from "../UserEditModal/UserEditModal"
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

  // API endpoints
  const API_BASE = 'https://roundrobin.luminlending.com/api';

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/`);
      const data = await response.json();
      
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
          location_id: updatedUser.location.location_id,
          selected_vendors: updatedUser.selected_vendors || []
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

  if (loading) {
    return <div className="user-table-container">Loading...</div>;
  }

  if (error) {
    return <div className="user-table-container">Error: {error}</div>;
  }

  return (
    <div className="user-table-container">
      <h1>User Management</h1>
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Cap Value</th>
              <th>States</th>
              <th>Location</th>
              <th>Lead Vendors</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.ghl_user_id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.cap_value}</td>
                <td>
                  <div className="states-list">
                    {user.states.map((state, index) => (
                      <span key={index} className="state-tag">
                        {state}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{ user?.location?.location_name ? user?.location?.location_name : ""}</td>
                <td>
                  <div className="states-list">
                    {(user.selected_vendors || []).map((vendor, index) => (
                      <span key={index} className="state-tag">
                        {vendor}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default UserTable;



// import React, { useState, useEffect } from 'react';
// import UserEditModal from '../UserEditModal/UserEditModal';
// import './style.css';

// const UserTable = () => {
//   const [users, setUsers] = useState([]);
//   const [states, setStates] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Mock API data
//   const mockUsers = [
//     {
//       id: 1,
//       email: 'john.doe@example.com',
//       name: 'John Doe',
//       capValue: 50000,
//       states: ['California', 'Texas'],
//       location: 'San Francisco'
//     },
//     {
//       id: 2,
//       email: 'jane.smith@example.com',
//       name: 'Jane Smith',
//       capValue: 75000,
//       states: ['New York', 'Florida'],
//       location: 'New York City'
//     },
//     {
//       id: 3,
//       email: 'bob.johnson@example.com',
//       name: 'Bob Johnson',
//       capValue: 60000,
//       states: ['Washington'],
//       location: 'Seattle'
//     },
//     {
//       id: 4,
//       email: 'alice.brown@example.com',
//       name: 'Alice Brown',
//       capValue: 80000,
//       states: ['California', 'Nevada'],
//       location: 'Los Angeles'
//     }
//   ];

//   const mockStates = [
//     { id: 1, name: 'California' },
//     { id: 2, name: 'Texas' },
//     { id: 3, name: 'New York' },
//     { id: 4, name: 'Florida' },
//     { id: 5, name: 'Washington' },
//     { id: 6, name: 'Nevada' },
//     { id: 7, name: 'Illinois' },
//     { id: 8, name: 'Pennsylvania' }
//   ];

//   const mockLocations = [
//     { id: 1, name: 'San Francisco' },
//     { id: 2, name: 'New York City' },
//     { id: 3, name: 'Seattle' },
//     { id: 4, name: 'Los Angeles' },
//     { id: 5, name: 'Chicago' },
//     { id: 6, name: 'Miami' },
//     { id: 7, name: 'Austin' },
//     { id: 8, name: 'Philadelphia' }
//   ];

//   // Simulate API calls
//   const fetchUsers = async () => {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(mockUsers), 500);
//     });
//   };

//   const fetchStates = async () => {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(mockStates), 300);
//     });
//   };

//   const fetchLocations = async () => {
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(mockLocations), 300);
//     });
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [usersData, statesData, locationsData] = await Promise.all([
//           fetchUsers(),
//           fetchStates(),
//           fetchLocations()
//         ]);
//         setUsers(usersData);
//         setStates(statesData);
//         setLocations(locationsData);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       }
//     };

//     loadData();
//   }, []);

//   const handleEditClick = (user) => {
//     setEditingUser(user);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingUser(null);
//   };

//   const handleSaveUser = (updatedUser) => {
//     setUsers(prevUsers =>
//       prevUsers.map(user =>
//         user.id === updatedUser.id ? updatedUser : user
//       )
//     );
//     handleCloseModal();
//   };

//   return (
//     <div className="user-table-container">
//       <h1>User Management</h1>
//       <div className="table-wrapper">
//         <table className="user-table">
//           <thead>
//             <tr>
//               <th>Email</th>
//               <th>Name</th>
//               <th>Cap Value</th>
//               <th>States</th>
//               <th>Location</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.email}</td>
//                 <td>{user.name}</td>
//                 <td>${user.capValue.toLocaleString()}</td>
//                 <td>
//                   <div className="states-list">
//                     {user.states.map((state, index) => (
//                       <span key={index} className="state-tag">
//                         {state}
//                       </span>
//                     ))}
//                   </div>
//                 </td>
//                 <td>{user.location}</td>
//                 <td>
//                   <button
//                     className="edit-btn"
//                     onClick={() => handleEditClick(user)}
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {isModalOpen && editingUser && (
//         <UserEditModal
//           user={editingUser}
//           states={states}
//           locations={locations}
//           onSave={handleSaveUser}
//           onClose={handleCloseModal}
//         />
//       )}
//     </div>
//   );
// };

// export default UserTable;
