

const BASE_URL = 'http://localhost:3000'; 

export const submitEnquiry = async (payload) => {
  const response = await fetch(`${BASE_URL}/enquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Server error');
  }

  return json;
};