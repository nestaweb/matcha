import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/server/db';
import transporter from '@/server/sendMail';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { firstName, lastName, email, password } = await req.json();

		const encryptedPassword = await bcrypt.hash(password, 10);
		console.log('Attempting to connect to database...');
		const result = await pool.query(
			'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
			[firstName, lastName, email, encryptedPassword]
		);
		console.log('Query successful:', result.rows);

		const requestOtp = await fetch(`${process.env.BASE_URL}/api/otps/createOtp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userId: result.rows[0].id })
		});

		const otp = await requestOtp.json();

		if (otp.error) {
			return NextResponse.json(otp, { status: 500 });
		}
		else if (otp.otp === undefined) {
			return NextResponse.json({ error: 'OTP not generated' }, { status: 500 });
		}

		const emailHtml = `<p>Hi ${firstName} ${lastName},</p><p>Here is your otp : ${otp.otp}</p>`;
		const message = {
			"Hi": `${firstName} ${lastName}`,
			"Here is your otp": otp.otp
		}

		const mailer = await transporter.sendMail({
			from: `"42Matcha"<${process.env.EMAIL_USERNAME}>`,
			to: email,
			subject: `Hello ${firstName} ${lastName} !`,
			text: JSON.stringify(message), 
			html: emailHtml
		})

		console.log('Email sent:', emailHtml);
		return NextResponse.json("Success", { status: 200 });
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}