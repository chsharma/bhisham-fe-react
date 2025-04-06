import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('inside user', user)
  if (user.token) {
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTA0MjI2MjUsInVzZXJfaWQiOiJjaHNoYXJtYSJ9.6WxzQykxIN5H5v8HaclcWpaXh8DHFD1XUMaatQLf8Io`;
  }
  return config;
});


// Dashboard
export const getDashboardCounts = async () => {
  console.log('inside this')
  try {
    console.log('Inside api post create User request')
    const response = await api.get('/dashboard/get-stats');
    console.log('user-response', response?.data?.data)
    return response?.data?.data
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

export const getUserList = async () => {
  console.log('inside this')
  try {
    console.log('Inside api  Get User request')
    const response = await api.get('user/get-users');
    console.log('user-response', response?.data?.data)
    return response?.data?.data
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

export const getRoleList = async (user) => {
  console.log('inside this')
  try {
    console.log('Inside api  Get User request')
    const userData = {
      name: user.name,
      login_id: user.login_id,
      password: user.password,
      role_id: user.role_id

    }
    const response = await api.get(`user/get-roles`, {
      params: userData
    });

    console.log('user-response', response?.data?.data)
    return response?.data?.data
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};





export const createUser = async (userData) => {

  try {
    console.log('Inside api post create User request', userData)
    const response = await api.post(`/user/create-user`, JSON.stringify(userData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.post(`user/update-user`, JSON.stringify(userData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUsePassword = async (userData) => {
  try {
    const response = await api.post(`user/update-password`, JSON.stringify(userData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const activeDeactiveUser = async (userData) => {
  try {
    const response = await api.post(`user/active-deactive`, JSON.stringify(userData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


export const getAllBhisham = async () => {
  try {
    console.log('inside bhishams')
    const response = await api.get('/dashboard/get-bhisham');
    console.log('bhisham-response', response?.data)
    return response?.data?.data
  } catch (error) {
    console.log('error', error)
  }
};

// Function to get raw data for a specific bhisham for downloading as CSV
export const getBhishamRawData = async (bhishamId) => {
  try {
    console.log('Fetching raw data for bhisham:', bhishamId);
    const response = await api.get(`/handheld/get-all-data?bhishamid=${bhishamId}`);
    console.log('Bhishm raw data response:', response?.data);
    return response?.data;
  } catch (error) {
    console.log('Error fetching bhisham raw data:', error);
    throw error;
  }
};

// Function to get full data for a specific bhisham for downloading as CSV
export const getBhishamFullData = async (bhishamId) => {
  try {
    console.log('Fetching full data for bhisham:', bhishamId);
    const response = await api.get(`/dashboard/get-mapp-data?bhishamid=${bhishamId}`);
    console.log('Bhishm full data response:', response?.data);
    return response?.data;
  } catch (error) {
    console.log('Error fetching bhisham full data:', error);
    throw error;
  }
};

export const createBhisham = async (bhishamData) => {
  // For demo: return api.post('/bhisham', bhishamData);
  try {
    console.log('bhisham data', bhishamData)
    const data = await api.post('/bhisham/create', JSON.stringify(bhishamData));
    console.log('created successfully')
  } catch (error) {

  }
  return Promise.resolve({
    data: {
      ...bhishamData,
      id: Date.now(),
      created_by: 'Admin User',
      status: 'incomplete',
      complete_time: null
    }
  });
};

export const completeBhisham = async (bhishamId) => {

  try {
    const response = await api.post(`/bhisham/create-data`, { "bhisham_id": bhishamId })
    console.log('cubes response', response.data)
    return response?.data
  } catch (err) {
    console.log('error', err)
  }
};

// MotherBox and Cubes management
export const getCubesByMotherBox = async (bhishamId, motherBoxId) => {
  // For demo: return api.get(/bhisham/${bhishamId}/motherbox/${motherBoxId}/cubes);
  try {
    const response = await api.get(`/dashboard/get-cubes?bhishamid=${bhishamId}&mcno=${motherBoxId}`)
    console.log('cubes response', response.data)
    return response?.data
  } catch (err) {
    console.log('error', err)
  }
};

export const getKitsByCube = async (bhishamId, motherBoxId, cubeId) => {
  // For demo: return api.get(/bhisham/${bhishamId}/motherbox/${motherBoxId}/cube/${cubeId}/kits);
  try {
    const response = await api.get(`/dashboard/get-kits?bhishamid=${bhishamId}&mcno=${motherBoxId}&ccno=${cubeId}`)
    console.log('kit response', response?.data)
    return response?.data
  } catch (err) {
    console.log('error', err)
  }
  return Promise.resolve({
    data: [
      { id: 1, name: 'Kit 1' },
      { id: 2, name: 'Kit 2' },
      { id: 3, name: 'Kit 3' },
    ]
  });
};

export const getItemsByKit = async (bhishamId, motherBoxId, cubeId, kitName, complete) => {
  // For demo: return api.get(dashboard/get-mapping-items?bhishamid=1&mcno=1&ccno=1&kitname=PAIN RELIEF KIT);
  try {

    const response = complete === 1 ? await api.get(`dashboard/get-items?bhishamid=${bhishamId}&mcno=${motherBoxId}&ccno=${cubeId}&kitslug=${kitName}`) :
      await api.get(`dashboard/get-mapping-items?bhishamid=${bhishamId}&mcno=${motherBoxId}&ccno=${cubeId}&kitslug=${kitName}`)
    console.log('item response', response?.data)
    return response?.data
  } catch (err) {
    console.log('error', err)
  }
  return Promise.resolve({
    data: [
      {
        id: 1,
        name: 'Item X',
        kitName: 'Kit 1',
        status: 'active',
        expiration: '2025-12-31',
        description: 'Primary component for system operation'
      },
      {
        id: 2,
        name: 'Item Y',
        kitName: 'Kit 1',
        status: 'active',
        expiration: '2025-10-15',
        description: 'Secondary support component'
      },
      {
        id: 3,
        name: 'Item Z',
        kitName: 'Kit 1',
        status: 'inactive',
        expiration: '2025-06-20',
        description: 'Backup component for emergency use'
      },
    ]
  });
};

export const getItemDetails = async (itemId) => {
  // For demo: return api.get(/items/${itemId});
  const items = [
    {
      id: 1,
      name: 'Item X',
      kitName: 'Kit 1',
      status: 'active',
      expiration: '2025-12-31',
      description: 'Primary component for system operation',
      serialNumber: 'IX-001',
      manufacturer: 'Tech Industries',
      lastUpdated: '2024-02-15'
    },
    {
      id: 2,
      name: 'Item Y',
      kitName: 'Kit 1',
      status: 'active',
      expiration: '2025-10-15',
      description: 'Secondary support component',
      serialNumber: 'IY-002',
      manufacturer: 'Tech Industries',
      lastUpdated: '2024-01-20'
    },
    {
      id: 3,
      name: 'Item Z',
      kitName: 'Kit 1',
      status: 'inactive',
      expiration: '2025-06-20',
      description: 'Backup component for emergency use',
      serialNumber: 'IZ-003',
      manufacturer: 'Backup Systems Inc',
      lastUpdated: '2023-11-30'
    },
  ];

  const item = items.find(i => i.id === itemId) || null;
  return Promise.resolve({ data: item });
};

export const updateItem = async (itemId, actionId) => {
  // For demo: return api.put(/items/${itemId}/update, { actionId });
  return Promise.resolve({
    data: {
      id: itemId,
      actionId,
      status: 'active',
      lastUpdated: new Date().toISOString().replace('T', ' ').substr(0, 19)
    }
  });
};

export const getAllUser = async (user) => {
  console.log('user here', user)
  try {
    const userData = {
      name: user.name,
      login_id: user.login_id,
      password: user.password,
      role_id: user.role_id

    }
    console.log(userData)
    const response = await api.get(`user/get-users`, {
      params: userData
    }); console.log(response)
    return response?.data?.data
  } catch (err) {
    console.log('error', err)
  }
}

export const updatePasswordPageApi = async (loginId, newPassword) => {
  console.log('user here', loginId, newPassword)
  try {
    const userData = {
      login_id: loginId,
      password: newPassword,
    }
    const response = await api.post(`user/update-password`, JSON.stringify(userData));
    console.log(response)
    return response?.data?.data
  } catch (err) {
    console.log('error', err)
  }
}

export const getUpdateDataType = async () => {
  try {

    const response = await api.get(`dashboard/data-update-type`);
    console.log(response)
    return response?.data?.data
  } catch (err) {
    console.log('error', err)
  }
}


export const createItem = async (itemData, complete) => {

  try {
    console.log('Inside api post create Item request', itemData)

    let url = complete ? 'bhisham/add-bhisham-data' : '/bhisham/add-mapping-data'
    const response = await api.post(url, JSON.stringify(itemData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateItems = async (itemData, complete) => {

  try {
    console.log('Inside api post update Item request', itemData)

    let url = complete ? 'bhisham/update-data' : '/bhisham/update-mapping-data'
    const response = await api.post(url, JSON.stringify(itemData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteItems = async (itemData, complete) => {

  try {
    console.log('Inside api post delete Item request', itemData)

    let url = complete ? 'bhisham/delete-bhisham-data' : '/bhisham/delete-mapping-data'
    const response = await api.post(url, JSON.stringify(itemData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const markAsUpdateItems = async (itemData, complete) => {

  try {
    console.log('Inside api post update Item request', itemData)

    let url = complete ? 'bhisham/mark-update-data' : '/bhisham/mark-update-mapping-data'
    const response = await api.post(url, JSON.stringify(itemData));
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


export default api;