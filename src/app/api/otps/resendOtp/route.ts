import { NextRequest, NextResponse } from 'next/server';
import pool from '@/server/db';
import { CryptoService } from '@/server/CryptoService';
import transporter from '@/server/sendMail';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { encryptedUserId, iv } = await req.json();

		const cryptoService = new CryptoService(process.env.ENCRYPTION_KEY!);

		const encryptedKey = { encryptedText: encryptedUserId, iv };
		const userId = parseInt(cryptoService.decrypt(encryptedKey));

		console.log('Attempting to connect to database...');
		const deleteOtps = await pool.query(
			'DELETE FROM otps WHERE user_id = $1',
			[userId]
		);

		console.log('Attempting to connect to database...');
		const user = await pool.query(
			'SELECT * FROM users WHERE id = $1',
			[userId]
		);

		if (user.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const {
			email,
			firstname, 
		} = user.rows[0];

		let otp;
		while (true) {
			otp = Math.floor(100000 + Math.random() * 900000);

			const otpExists = await pool.query(
				'SELECT * FROM otps WHERE otp = $1',
				[otp]
			);

			if (otpExists.rows.length === 0) {
				break;
			}
		}

		console.log('Attempting to connect to database...');
		const result = await pool.query(
			'INSERT INTO otps (user_id, otp) VALUES ($1, $2) RETURNING *',
			[userId, otp]
		);


		const dayNumber = new Date().getDate();
		const MonthNumber = new Date().getMonth();
		const Month = new Date().toLocaleString('default', { month: 'short' });
		const Year = new Date().getFullYear();

		const otpNumber = otp;

		const data = JSON.stringify({ userId, otpNumber });
		const cryptedKey = cryptoService.encrypt(data);
		const cryptedUserId = cryptoService.encrypt(userId.toString());

		const url = `${process.env.NEXT_PUBLIC_BASE_URL}/register?step=2&otp=${cryptedKey.encryptedText}.${cryptedKey.iv}&userId=${cryptedUserId.encryptedText}.${cryptedUserId.iv}`;

		const emailHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>OTP Verification</title><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet"></head><body style="margin:0;font-family:Poppins,sans-serif;background:#fff;font-size:14px"><div style="max-width:680px;margin:0 auto;padding:45px 30px 60px;background:#f4f7ff;background-image:url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);background-repeat:no-repeat;background-size:800px 452px;background-position:top center;font-size:14px;color:#434343"><header><table style="width:100%"><tbody><tr style="height:0"><td style="color:#ffffff;font-size:20px">42Matcha</td><td style="text-align:right"><span style="font-size:16px;line-height:30px;color:#ffffff">${dayNumber} ${Month}, ${Year}</span></td></tr></tbody></table></header><main><div style="margin:0;margin-top:70px;padding:92px 30px 115px;background:#fff;border-radius:30px;text-align:center"><div style="width:100%;max-width:489px;margin:0 auto"><h1 style="margin:0;font-size:24px;font-weight:500;color:#1f1f1f">Your OTP</h1><p style="margin:0;margin-top:17px;font-size:16px;font-weight:500">Hey ${firstname},</p><p style="margin:0;margin-top:17px;font-weight:500;letter-spacing:.56px">Use the following OTP to complete the registering procedure. OTP is valid for <span style="font-weight:600;color:#1f1f1f">5 minutes</span>. Do not share this code with others, including Archisketch employees.</p><p style="margin:0;margin-top:60px;font-size:40px;font-weight:600;letter-spacing:25px;color:#1761E8">${otpNumber}</p></div><p>Or just click <a href="${url}" style="color:#499fb6;text-decoration:none">here</a></p></div><p style="max-width:400px;margin:0 auto;margin-top:90px;text-align:center;font-weight:500;color:#8c8c8c">Need help? Ask at <a href="mailto:nloisy.42@gmail.com" style="color:#499fb6;text-decoration:none">batman@gmail.com</a> or visit our <a href="" target="_blank" style="color:#499fb6;text-decoration:none">Help Center</a></p></main><footer style="width:100%;max-width:490px;margin:20px auto 0;text-align:center;border-top:1px solid #e6ebf1"><p style="margin:0;margin-top:40px;font-size:16px;font-weight:600;color:#434343">42Matcha</p><p style="margin:0;margin-top:8px;color:#434343">Batcave</p><div style="margin:0;margin-top:16px"></div><p style="margin:0;margin-top:16px;color:#434343">Copyright © 2024 42Matcha. All rights reserved.</p></footer></div></body></html>`;
		const message = {
			"Hi": `${firstname}`,
			"Here is your otp": otp,
			"Or click on the link below to verify your email": url
		}

		const mailer = await transporter.sendMail({
			from: `"42Matcha"<${process.env.EMAIL_USERNAME}>`,
			to: email,
			subject: `Hello ${firstname} !`,
			text: JSON.stringify(message), 
			html: emailHtml
		})

		console.log('Email sent:', message);

		console.log('Query successful:', result.rows);
		return NextResponse.json(result.rows[0]);
  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}