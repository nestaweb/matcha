// src/app/users/page.tsx
import React from 'react';

async function getUsers() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/users`, { 
      cache: 'no-store',
	  next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    
	const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function UsersPage() {
	// Fetch users
	const users = await getUsers();
  
	return (
	  <div>
		<h1>Users</h1>
		{/* Handle empty data gracefully */}
		{users.length > 0 ? (
		  <pre>{JSON.stringify(users, null, 2)}</pre>
		) : (
		  <p>No users found or failed to fetch users.</p>
		)}
	  </div>
	);
}