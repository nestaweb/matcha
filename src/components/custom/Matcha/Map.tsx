'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/button';
import { CryptoService } from '@/server/CryptoService';

interface UserLocation {
    id: number;
    firstName: string;
    lastName: string;
    location: string;
    city: string;
}

interface MapLocation {
    lat: number;
    lng: number;
}

const MapView: React.FC = () => {
    const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
    const [mapCenter, setMapCenter] = useState<MapLocation>({ lat: 0, lng: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true);
                // Get the user ID from the cookie using document.cookie
                const cookies = document.cookie.split(';');
                const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('userId='));
                
                if (!userIdCookie) {
                    setError('User not authenticated');
                    return;
                }

                const encryptedUserId = userIdCookie.split('=')[1].trim();
                const response = await fetch('/api/users/getGridUserLocations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ encryptedUserId })
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserLocations(data);
                    
                    if (data.length > 0) {
                        const firstLocation = data[0].location.split(',');
                        setMapCenter({
                            lat: parseFloat(firstLocation[0]),
                            lng: parseFloat(firstLocation[1])
                        });
                    } else {
                        setError('No users with location data available');
                    }
                } else {
                    setError('Failed to fetch user locations');
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('An error occurred while fetching locations');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
    };

    const handleMarkerClick = (user: UserLocation) => {
        setSelectedUser(user);
    };

    const handleViewProfile = (userId: number) => {
        const encryptedUserId = cryptoService.encrypt(userId.toString());
        const encryptedParamUserId = encryptedUserId.encryptedText + '.' + encryptedUserId.iv;
        router.push(`/user/${encryptedParamUserId}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                    <h1 className="text-xl font-bold">Loading map...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={userLocations.length > 0 ? 5 : 2}
                    options={options}
                >
                    {userLocations.map((user) => {
                        const [lat, lng] = user.location.split(',').map(Number);
                        return (
                            <Marker
                                key={user.id}
                                position={{ lat, lng }}
                                onClick={() => handleMarkerClick(user)}
                            />
                        );
                    })}
                    {selectedUser && (
                        <InfoWindow
                            position={{
                                lat: parseFloat(selectedUser.location.split(',')[0]),
                                lng: parseFloat(selectedUser.location.split(',')[1])
                            }}
                            onCloseClick={() => setSelectedUser(null)}
                        >
                            <div className="p-2">
                                <h3 className="font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                <p className="mb-2">{selectedUser.city}</p>
                                <Button 
                                    onClick={() => handleViewProfile(selectedUser.id)}
                                    className="w-full"
                                >
                                    View Profile
                                </Button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default MapView; 