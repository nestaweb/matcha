'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const UserProfile: React.FC = () => {

	useEffect(() => {
		redirect('/user/me');
	});

	return null;
}

export default UserProfile;