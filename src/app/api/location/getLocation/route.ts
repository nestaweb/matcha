import { NextResponse } from 'next/server';

export async function POST() {
	try {
		const ipResponse = await fetch('https://api.ipify.org?format=json');
		const { ip } = await ipResponse.json();

		const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
		const geoData = await geoResponse.json();


		if (geoData.status === 'fail') {
			throw new Error('Unable to fetch geolocation');
		}

		return NextResponse.json({ longitude: geoData.lon, latitude: geoData.lat }, { status: 200 });
	} catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}
