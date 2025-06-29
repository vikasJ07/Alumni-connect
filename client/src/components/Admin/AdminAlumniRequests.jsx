import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image

    // Fetch pending requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/admin/pendingRequests');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRequests(data);
                } else {
                    setRequests([]); // Default to an empty array if the format is unexpected
                }
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // Approve a request
    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/approveReject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, action: 'approve' }),
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setRequests(requests.filter((req) => req.id !== id));
            } else {
                alert('Error approving request: ' + result.error);
            }
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    // Reject a request
    const handleReject = async (id) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(`http://localhost:3000/api/admin/approveReject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, action: 'reject', reason }),
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setRequests(requests.filter((req) => req.id !== id));
            } else {
                alert('Error rejecting request: ' + result.error);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    // Open image modal
    const openImageModal = (imgSrc) => {
        setSelectedImage(imgSrc);
    };

    // Close image modal
    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="container mx-auto p-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
                <p className="text-lg text-gray-600 mt-2">You are logged in as an administrator.</p>
            </header>

            <section>
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-4">Pending Alumni Requests</h2>
            </section>

            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length === 0 ? (
                <p>No pending requests.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="max-w-sm w-full p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-lg"
                        >
                            <img
                                src={request.documentPath}
                                alt="Document"
                                className="w-full h-64 object-cover mb-4 cursor-pointer rounded-lg"
                                onClick={() => openImageModal(request.documentPath)} // Trigger modal on image click
                            />
                            <p><strong>Name:</strong> {request.name}</p>
                            <p><strong>Username:</strong> {request.username}</p>
                            <p><strong>Email:</strong> {request.email}</p>
                            <p><strong>Graduation Year:</strong> {request.graduationYear}</p>

                            <div className="mt-4 flex justify-center gap-4">
                                <button
                                    onClick={() => handleApprove(request.id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(request.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl mx-auto">
                        <img
                            src={selectedImage}
                            alt="Selected Document"
                            className="w-full h-auto object-contain"
                        />
                        <button
                            onClick={closeImageModal}
                            className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
