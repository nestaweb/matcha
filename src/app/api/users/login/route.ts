import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/server/db';
import transporter from '@/server/sendMail';
import { cookies } from 'next/headers';
import { CryptoService } from '@/server/CryptoService';

export async function POST(req: NextRequest) {
	if (!req.body) {
		return NextResponse.json({ error: 'Missing body' }, { status: 400 });
	}
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
		}

		const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

		const user = await pool.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);

		if (user.rows.length === 0) {
			return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
		}

		const userExists = user.rows[0];
		const passwordMatch = await bcrypt.compare(password, userExists.password);

		if (!passwordMatch) {
			return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
		}

		const encryptedUserId = cryptoService.encrypt(userExists.id.toString());
		const encryptedParamUserId = encryptedUserId.encryptedText + '.' + encryptedUserId.iv;
		const encryptedEmail = cryptoService.encrypt(userExists.email.toString());
		const encryptedParamEmail = encryptedEmail.encryptedText + '.' + encryptedEmail.iv;
		const cookieStore = await cookies();

		cookieStore.set('userId', encryptedParamUserId);

		const lastSeen = new Date().toISOString();
		const updateLastSeen = await pool.query(
			'UPDATE users SET last_seen = $1 WHERE id = $2',
			[lastSeen, userExists.id]
		);


		const dayNumber = new Date().getDate();
		const Month = new Date().toLocaleString('default', { month: 'short' });
		const Year = new Date().getFullYear();

		const url = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword?email=${encryptedEmail.encryptedText}.${encryptedEmail.iv}`;

		const emailHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>New Connection</title><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet"></head><body style="margin:0;font-family:Poppins,sans-serif;background:#fff;font-size:14px"><div style="max-width:680px;margin:0 auto;padding:45px 30px 60px;background:#f4f7ff;background-image:url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);background-repeat:no-repeat;background-size:800px 452px;background-position:top center;font-size:14px;color:#434343"><header><table style="width:100%"><tbody><tr style="height:0"><td style="color:#ffffff;font-size:20px">42Matcha</td><td style="text-align:right"><span style="font-size:16px;line-height:30px;color:#ffffff">${dayNumber} ${Month}, ${Year}</span></td></tr></tbody></table></header><main><div style="margin:0;margin-top:70px;padding:92px 30px 115px;background:#fff;border-radius:30px;text-align:center"><div style="width:100%;max-width:489px;margin:0 auto"><h1 style="margin:0;font-size:24px;font-weight:500;color:#1f1f1f">New Connection</h1><p style="margin:0;margin-top:17px;font-size:16px;font-weight:500">Hey ${userExists.firstname},</p><p style="margin:0;margin-top:17px;font-weight:500;letter-spacing:.56px">We noticed a new connection on your account ${userExists.firstname}. If you are behind this action, please ignore this email. If you are not, you can reset your password by clicking on the link below or you can call batman to catch the bad guy.</p><p style="margin:0;margin-top:60px;font-size:40px;font-weight:600;letter-spacing:25px;color:#1761E8"></p></div><p>Click <a href="${url}" style="color:#499fb6;text-decoration:none">here</a> to reset your password</p></div><p style="max-width:400px;margin:0 auto;margin-top:90px;text-align:center;font-weight:500;color:#8c8c8c">Need help? Ask at <a href="mailto:nloisy.42@gmail.com" style="color:#499fb6;text-decoration:none">batman@gmail.com</a> or visit our <a href="" target="_blank" style="color:#499fb6;text-decoration:none">Help Center</a></p></main><footer style="width:100%;max-width:490px;margin:20px auto 0;text-align:center;border-top:1px solid #e6ebf1"><p style="margin:0;margin-top:40px;font-size:16px;font-weight:600;color:#434343">42Matcha</p><p style="margin:0;margin-top:8px;color:#434343">Batcave</p><div style="margin:0;margin-top:16px"></div><p style="margin:0;margin-top:16px;color:#434343">Copyright © 2024 42Matcha. All rights reserved.</p></footer></div></body></html>`;
		const message = {
			"Hi": `${userExists.firstname}`,
			"Click to reset your password": url
		}

		const mailer = await transporter.sendMail({
			from: `"42Matcha"<${process.env.EMAIL_USERNAME}>`,
			to: email,
			subject: `New connection ${userExists.firstname} !`,
			text: JSON.stringify(message), 
			html: emailHtml
		})

		console.log('Email sent:', message);
		return NextResponse.json(encryptedParamUserId, { status: 200 });

  	}
	catch (error: any) {
		console.error('Database connection error:', error);
		return NextResponse.json({ 
			error: error.message, 
			stack: error.stack 
		}, { status: 500 });
	}
}