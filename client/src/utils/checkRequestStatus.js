const checkRequestStatus = async (username) => {
    try {
        const response = await fetch('http://localhost:3000/api/pending/checkRequestStatus', {
            method: 'POST', // Use POST to send the username in the body
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }), // Include username in the request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to check request status:', error);
    }
};

export default checkRequestStatus;
