
// import React, { useState, useEffect } from 'react';
// import './style.css';

// const UserEditModal = ({
//   user,
//   states,
//   locations,
//   onSave,
//   onClose
// }) => {
//   const [formData, setFormData] = useState({
//     ...user,
//     location: user.location || { location_id: '', location_name: '' }
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     setFormData({
//       ...user,
//       location: user.location || { location_id: '', location_name: '' }
//     });
//   }, [user]);

//   const validateCapValue = (value) => {
//     const numValue = parseInt(value, 10);
//     return !isNaN(numValue) && numValue >= 0 && value === numValue.toString();
//   };

//   const handleCapValueChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || validateCapValue(value)) {
//       setFormData(prev => ({
//         ...prev,
//         cap_value: value === '' ? 0 : parseInt(value, 10)
//       }));
//       setErrors(prev => ({ ...prev, cap_value: '' }));
//     } else {
//       setErrors(prev => ({ ...prev, cap_value: 'Please enter a valid integer' }));
//     }
//   };

//   const handleStateToggle = (stateName) => {
//     setFormData(prev => ({
//       ...prev,
//       states: prev.states.includes(stateName)
//         ? prev.states.filter(s => s !== stateName)
//         : [...prev.states, stateName]
//     }));
//   };

//   const handleLocationChange = (e) => {
//     const selectedLocationId = e.target.value;
//     const selectedLocation = locations.find(loc => loc.location_id === selectedLocationId);
    
//     setFormData(prev => ({
//       ...prev,
//       location: selectedLocation || { location_id: '', location_name: '' }
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate form
//     const newErrors = {};
    
//     if (formData.cap_value < 0) {
//       newErrors.cap_value = 'Cap value must be non-negative';
//     }
    
//     if (formData.states.length === 0) {
//       newErrors.states = 'Please select at least one state';
//     }
    
//     if (!formData.location.location_id) {
//       newErrors.location = 'Please select a location';
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       onSave(formData);
//     }
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Edit User</h2>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="modal-form">
//           <div className="form-group">
//             <label>Email (Read Only):</label>
//             <input
//               type="email"
//               value={formData.email}
//               disabled
//               className="readonly-input"
//             />
//           </div>

//           <div className="form-group">
//             <label>Name (Read Only):</label>
//             <input
//               type="text"
//               value={formData.name}
//               disabled
//               className="readonly-input"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="capValue">Cap Value: *</label>
//             <input
//               id="capValue"
//               type="text"
//               value={formData.cap_value}
//               onChange={handleCapValueChange}
//               placeholder="Enter integer value"
//               className={errors.cap_value ? 'error' : ''}
//             />
//             {errors.cap_value && (
//               <span className="error-message">{errors.cap_value}</span>
//             )}
//           </div>

//           <div className="form-group">
//             <label>States: *</label>
//             <div className="states-container">
//               <div className="selected-states">
//                 {formData.states.length > 0 ? (
//                   formData.states.map((state, index) => (
//                     <span key={index} className="selected-state-tag">
//                       {state}
//                       <button
//                         type="button"
//                         onClick={() => handleStateToggle(state)}
//                         className="remove-state-btn"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))
//                 ) : (
//                   <span className="no-states">No states selected</span>
//                 )}
//               </div>
//               <div className="states-dropdown">
//                 <label>Add States:</label>
//                 <div className="state-options">
//                   {states.map((state, index) => (
//                     <label key={index} className="state-option">
//                       <input
//                         type="checkbox"
//                         checked={formData.states.includes(state)}
//                         onChange={() => handleStateToggle(state)}
//                       />
//                       <span>{state}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             {errors.states && (
//               <span className="error-message">{errors.states}</span>
//             )}
//           </div>

//           <div className="form-group">
//             <label htmlFor="location">Location: *</label>
//             <select
//               id="location"
//               value={formData.location.location_id}
//               onChange={handleLocationChange}
//               className={errors.location ? 'error' : ''}
//             >
//               <option value="">Select a location</option>
//               {locations.map((location) => (
//                 <option key={location.location_id} value={location.location_id}>
//                   {location.location_name}
//                 </option>
//               ))}
//             </select>
//             {errors.location && (
//               <span className="error-message">{errors.location}</span>
//             )}
//           </div>

//           <div className="modal-actions">
//             <button type="button" onClick={onClose} className="cancel-btn">
//               Cancel
//             </button>
//             <button type="submit" className="save-btn">
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserEditModal;



import React, { useState, useEffect } from 'react';
import './style.css';

const UserEditModal = ({
  user,
  states,
  locations,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const validateCapValue = (value) => {
    const numValue = parseInt(value, 10);
    return !isNaN(numValue) && numValue >= 0 && value === numValue.toString();
  };

  const handleCapValueChange = (e) => {
    const value = e.target.value;
    if (value === '' || validateCapValue(value)) {
      setFormData(prev => ({
        ...prev,
        capValue: value === '' ? 0 : parseInt(value, 10)
      }));
      setErrors(prev => ({ ...prev, capValue: '' }));
    } else {
      setErrors(prev => ({ ...prev, capValue: 'Please enter a valid integer' }));
    }
  };

  const handleStateToggle = (stateName) => {
    setFormData(prev => ({
      ...prev,
      states: prev.states.includes(stateName)
        ? prev.states.filter(s => s !== stateName)
        : [...prev.states, stateName]
    }));
  };

  const handleLocationChange = (e) => {
    setFormData(prev => ({
      ...prev,
      location: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (formData.capValue < 0) {
      newErrors.capValue = 'Cap value must be non-negative';
    }
    
    if (formData.states.length === 0) {
      newErrors.states = 'Please select at least one state';
    }
    
    if (!formData.location) {
      newErrors.location = 'Please select a location';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit User</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capValue">Cap Value: *</label>
            <input
              id="capValue"
              type="text"
              value={formData.capValue}
              onChange={handleCapValueChange}
              placeholder="Enter integer value"
              className={errors.capValue ? 'error' : ''}
            />
            {errors.capValue && (
              <span className="error-message">{errors.capValue}</span>
            )}
          </div>

          <div className="form-group">
            <label>States: *</label>
            <div className="states-container">
              <div className="selected-states">
                {formData.states.length > 0 ? (
                  formData.states.map((state, index) => (
                    <span key={index} className="selected-state-tag">
                      {state}
                      <button
                        type="button"
                        onClick={() => handleStateToggle(state)}
                        className="remove-state-btn"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="no-states">No states selected</span>
                )}
              </div>
              <div className="states-dropdown">
                <label>Add States:</label>
                <div className="state-options">
                  {states.map((state) => (
                    <label key={state.id} className="state-option">
                      <input
                        type="checkbox"
                        checked={formData.states.includes(state.name)}
                        onChange={() => handleStateToggle(state.name)}
                      />
                      <span>{state.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {errors.states && (
              <span className="error-message">{errors.states}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location: *</label>
            <select
              id="location"
              value={formData.location}
              onChange={handleLocationChange}
              className={errors.location ? 'error' : ''}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.location && (
              <span className="error-message">{errors.location}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
